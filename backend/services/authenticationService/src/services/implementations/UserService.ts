import { inject, injectable } from "inversify";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import Stripe from "stripe";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { IUsers } from "../../entities/UserEntity";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import UserProducer from "../../events/kafka/producers/UserProducer";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IUserService } from "../interfaces/IUserService";


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

@injectable()
export default class UserService implements IUserService {
    private userRepository: IUserRepository;
    private kafkaConnection: IKafkaConnection

    constructor(
        @inject("IUserRepository") userRepository: IUserRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection

    ) {
        this.userRepository = userRepository;
        this.kafkaConnection = kafkaConnection
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
        return { accessToken, refreshToken,decodedToken,userExist }
    }
}