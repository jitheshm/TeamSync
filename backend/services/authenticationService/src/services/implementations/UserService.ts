import { inject, injectable } from "inversify";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import Stripe from "stripe";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { IUsers } from "../../entities/UserEntity";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IUserService, VerifyOtpResponse } from "../interfaces/IUserService";
import { generateOtp, sendOtp } from "../../utils/otp";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ISubscriptionRepository } from "../../repository/interface/ISubscriptionRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import mongoose from "mongoose";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import hash from "../../utils/bcrypt";
import { CustomError, IKafkaConnection, InvalidCredentialsError, NotFound, UnauthorizedError } from "teamsync-common";
import UserProducer from "../../events/kafka/producers/UserProducer";
import OtpProducer from "../../events/kafka/producers/OtpProducer";


const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const app = initializeApp(firebaseConfig);
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;



@injectable()
export default class UserService implements IUserService {
    private userRepository: IUserRepository;
    private kafkaConnection: IKafkaConnection
    private subscriptionRepository: ISubscriptionRepository;
    private tenantUserRepository: ITenantUserRepository;
    private otpRepository: IOtpRepository;


    constructor(
        @inject("IUserRepository") userRepository: IUserRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
        @inject("ITenantUserRepository") tenantUserRepository: ITenantUserRepository,
        @inject("IOtpRepository") otpRepository: IOtpRepository



    ) {
        this.userRepository = userRepository;
        this.kafkaConnection = kafkaConnection
        this.subscriptionRepository = subscriptionRepository
        this.tenantUserRepository = tenantUserRepository
        this.otpRepository = otpRepository
    }

    async firebaseLogin(token: string) {
        const auth = getAuth(app);
        const decodedToken = await auth.verifyIdToken(token);
        let userExist = await this.userRepository.fetchUserByAuthId(decodedToken.uid)
        if (!userExist) {
            if (decodedToken.firebase.sign_in_provider === 'google.com') {
                userExist = await this.userRepository.fetchUser(decodedToken.email as string)

            }

            if (!userExist) {


                const newUser: Partial<IUsers> = {

                    first_name: decodedToken.name ?? '',
                    last_name: '',
                    email: decodedToken.email ?? '',
                    password: '',
                    user_id: '#user' + new Date().getTime() + Math.floor(Math.random() * 1000),
                    authentication_id: decodedToken.uid,
                    authentication_provider: decodedToken.firebase.sign_in_provider,
                    created_at: new Date(),
                    phone_no: null,
                    is_verified: true
                };

                const customer = await stripe.customers.create({
                    email: newUser.email,
                    name: newUser.first_name,
                });

                newUser.stripe_customer_id = customer.id


                userExist = await this.userRepository.create(newUser)


                const producer = await this.kafkaConnection.getProducerInstance()
                const userProducer = new UserProducer(producer, 'main', 'users')
                userProducer.sendMessage('create', userExist)




            }
        }
        const accessToken = generateAccessToken({ email: decodedToken.email ?? "", name: decodedToken.name, id: userExist._id, tenantId: userExist?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        const refreshToken = generateRefreshToken({ email: decodedToken.email ?? "", name: decodedToken.name, id: userExist._id, tenantId: userExist?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        return { accessToken, refreshToken, decodedToken, userExist }
    }

    async forgetPassword(email: string) {
        const userData = await this.userRepository.fetchUser(email);
        if (!userData) {
            throw new NotFound("User not found")
        }
        if (userData.is_blocked) {
            throw new CustomError("user is blocked", 403)
        }

        sendOtp(email, 'forgot-password')
    }

    async login(email: string, password: string) {
        const userData = await this.userRepository.fetchUser(email);
        if (!userData) {
            throw new NotFound("User not found")
        }
        const resObj = await bcrypt.compare(password, userData.password)

        if (!resObj) {
            throw new InvalidCredentialsError("Invalid email or password")
        }
        if (userData.is_blocked) {
            throw new CustomError("User is blocked", 403)
        }
        if (!userData.is_verified) {
            throw new CustomError("User is not verified", 403)
        }

        const accessToken = generateAccessToken({ email: userData.email, name: userData.first_name, id: userData._id, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        const refreshToken = generateRefreshToken({ email: userData.email, name: userData.first_name, id: userData._id, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        return { accessToken, refreshToken, userData }
    }

    async newToken(refreshToken: string) {

        const payload: jwt.JwtPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;

        if (payload.role === 'Tenant_Admin') {
            const userData = await this.userRepository.fetchUser(payload.email);
            if (!userData) throw new UnauthorizedError();
            if (userData.is_blocked) throw new CustomError("User is blocked", 403);
            if (!userData.is_verified) throw new CustomError("User is not verified", 403);
        } else {

            const subscriptionData = await this.subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(payload.tenantId));

            if (!subscriptionData) throw new UnauthorizedError();
            if (subscriptionData.status !== 'paid') throw new CustomError("Company account suspended", 403);

            const userData = await this.tenantUserRepository.fetchSpecificUser(payload.tenantId, payload.email);
            if (!userData) throw new UnauthorizedError();
            if (userData.is_deleted) throw new UnauthorizedError();

        }


        const data = {
            email: payload.email,
            name: payload.first_name,
            id: payload.id,
            tenantId: payload.tenantId,
            role: payload.role,
            branchId: payload.branchId ?? ""
        }

        const newAccessToken = generateAccessToken(data);
        return newAccessToken
    }

    async verifyOtp({ email, otp, context, tenantId }: { email: string, otp: string, context: string, tenantId?: string }): Promise<VerifyOtpResponse> {
        const otpExist = await this.otpRepository.fetchOtp(email);
        if (!otpExist) {
            throw new NotFound("OTP not found");
        }
        if (otpExist.context !== context || otpExist.otp !== otp) {
            throw new CustomError("Invalid or expired OTP.", 401);
        }

        switch (context) {
            case 'signup': {
                const userObj = await this.userRepository.verifyUser(email);
                const producer = await this.kafkaConnection.getProducerInstance();
                const userProducer = new UserProducer(producer, 'main', 'users');
                userProducer.sendMessage('update', userObj);

                const token = jwt.sign({ email: userObj.email, name: userObj.first_name, id: userObj._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
                return { message: "User verified successfully", verified: true, token, name: userObj.first_name, role: 'Tenant_Admin', id: userObj._id };
            }

            case 'forgot-password': {
                const token = jwt.sign({ email }, process.env.JWT_OTP_SECRET_KEY!, { expiresIn: '1h' });
                return { message: "OTP verified successfully", token };
            }

            case 'tenant_login': {
                if (!tenantId) {
                    throw new CustomError("Tenant ID is required", 400);
                }

                const subscriptionData = await this.subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(tenantId));
                if (!subscriptionData) throw new UnauthorizedError();
                if (subscriptionData.status !== 'paid') throw new CustomError("Company account suspended", 403);

                const userObj = await this.tenantUserRepository.fetchSpecificUser(tenantId, email);
                if (!userObj) {
                    throw new CustomError("Invalid email address", 401);
                }

                const accessToken = generateAccessToken({ email, name: userObj.name, id: userObj._id, tenantId, role: userObj.role, branchId: userObj.branch_id });
                const refreshToken = generateRefreshToken({ email, name: userObj.name, id: userObj._id, tenantId, role: userObj.role, branchId: userObj.branch_id });
                return { message: "User verified", verified: true, accessToken, refreshToken, name: userObj.name as string, tenantId, role: userObj.role as string, id: userObj._id };
            }

            default:
                throw new CustomError("Invalid context provided", 400);
        }
    }

    async resendOtp(email: string, context: string, tenantId?: string) {
        if (!tenantId) {
            const userData = await this.userRepository.fetchUser(email);
            if (!userData) {
                throw new NotFound("User not found");
            }
            if (userData.is_blocked) {
                throw new CustomError("User is blocked", 403);
            }
        } else {

            const userData = await this.tenantUserRepository.fetchSpecificUser(tenantId, email);


            if (!userData) {
                throw new CustomError("Invalid email address", 401);
            }


        }


        sendOtp(email, context);
    }

    async resetPassword(email: string, newPassword: string) {

        const password = hash(newPassword)
        const updateUserObj = await this.userRepository.updateUser({ email: email, password: password })

        if (!updateUserObj) {
            throw new NotFound("user not found")
        } else {
            const producer = await this.kafkaConnection.getProducerInstance()
            const userProducer = new UserProducer(producer, 'main', 'users')
            userProducer.sendMessage('update', updateUserObj)

        }

    }

    async tenantLogin(email: string, role: string, tenantId: string) {
        const userData = await this.tenantUserRepository.fetchSpecificUser(tenantId, email);
        if (!userData) {
            throw new InvalidCredentialsError("Invalid email address")
        }
        if (userData.role !== role) {
            throw new InvalidCredentialsError("Invalid email address")
        }

        if (userData.is_deleted) {
            throw new CustomError("User is deleted", 403)
        }
        sendOtp(email, 'tenant_login')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleTenantUserEvents(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':

                await this.tenantUserRepository.create(dataObj.data, dataObj.dbName)
                break;
            case 'update':

                await this.tenantUserRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                break;


        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleUserEvents(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':


                {
                    await this.userRepository.create(dataObj.data)
                    const otp = generateOtp()
                    
                    const otpObj = {
                        email: dataObj.data.email,
                        otp: `${otp}`,
                        context: 'signup'
                    }
                    await this.otpRepository.create(otpObj, dataObj.data.email)


                    const producer = await this.kafkaConnection.getProducerInstance()
                    const otpProducer = new OtpProducer(producer, 'main', 'otps')
                    otpProducer.sendMessage('create', otpObj)
                    break;
                }



            case 'update':
                await this.userRepository.updateUser(dataObj.data)
                break;

            case 'resendOtp':
                {
                    const otp = generateOtp()
                    const otpObj = {
                        email: dataObj.data.email,
                        otp: `${otp}`,
                        context: 'signup'
                    }
                    await this.otpRepository.create(otpObj, dataObj.data.email)


                    const producer = await this.kafkaConnection.getProducerInstance()
                    const otpProducer = new OtpProducer(producer, 'main', 'otps')
                    otpProducer.sendMessage('create', otpObj)
                    break

                }


        }
    }



}