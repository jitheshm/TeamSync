

import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';
import { IUsers } from '../../entities/UserEntity';
import Stripe from 'stripe';
import { IKafkaConnection } from '../../interfaces/IKafkaConnection';
import UserProducer from '../../events/kafka/producers/UserProducer';
import { IUserRepository } from '../../repository/interface/IUserRepository';
import app from '../../config/firebase/firebaseConfig';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

interface DecodedToken {
    uid: string;
    name?: string;
    email?: string;
    firebase: {
        sign_in_provider: string;
    };
}

interface UserServiceProps {
    userRepository: IUserRepository;
    kafkaConnection?: IKafkaConnection;

}

export class UserService {
    private userRepository: IUserRepository;
    private stripe: Stripe;
    private kafkaConnection?: IKafkaConnection;

    constructor({ userRepository, kafkaConnection }: UserServiceProps) {
        this.userRepository = userRepository;
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        this.kafkaConnection = kafkaConnection;
    }

    public async verifyUserToken(token: string): Promise<any | null> {
        try {
            const auth = getAuth(app);
            const decodedToken = await auth.verifyIdToken(token);
            console.log('decodedToken:', decodedToken);

            return decodedToken;
        } catch (error) {
            console.error('Error verifying user token:', error);
            return null;
        }
    }

    public async createUserFromFirebase(decodedToken: DecodedToken): Promise<any> {
        try {
            let userExist = await this.userRepository.fetchUserByAuthId(decodedToken.uid);

            if (!userExist) {
                if (decodedToken.firebase.sign_in_provider === 'google.com') {
                    userExist = await this.userRepository.fetchUser(decodedToken.email as string);
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
                        is_verified: true,
                    };

                    const customer = await this.stripe.customers.create({
                        email: newUser.email,
                        name: newUser.first_name,
                    });

                    newUser.stripe_customer_id = customer.id;

                    userExist = await this.userRepository.create(newUser);

                    const producer = await this.kafkaConnection?.getProducerInstance();
                    if (producer) {
                        const userProducer = new UserProducer(producer, 'main', 'users');
                        userProducer.sendMessage('create', userExist);
                    }
                }
            }

            if (!process.env.JWT_SECRET_KEY) {
                throw new Error('JWT secret key not set');
            }
            console.log('decodedToken:', decodedToken.email);

            const token = jwt.sign(
                {
                    email: decodedToken.email ?? '',
                    name: decodedToken.name,
                    id: userExist._id,
                    tenantId: userExist?.tenant?.[0]?._id,
                    role: 'Tenant_Admin'
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            return {
                token,
                name: decodedToken.name,
                tenantId: userExist?.tenant?.[0]?._id,
                role: 'Tenant_Admin',
                id: userExist._id,
            };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async authenticateUser(email: string, password: string) {
        const userData = await this.userRepository.fetchUser(email);

        if (!userData) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return null;
        }

        return userData;
    }

    async signup(email: string): Promise<{ token: string; name: string; id: mongoose.Schema.Types.ObjectId } | null> {
        try {
            const userObj = await this.userRepository.verifyUser(email);

            // Kafka producer logic
            let producer = await this.kafkaConnection?.getProducerInstance();
            if (producer) {
                let userProducer = new UserProducer(producer, 'main', 'users');
                userProducer.sendMessage('update', userObj);
            }

            // JWT token generation
            const token = jwt.sign({ email: userObj.email, name: userObj.first_name, id: userObj._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

            return { token, name: userObj.first_name, id: userObj._id };
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async forgotPassword(email: string): Promise<string> {
        try {
            const token = jwt.sign({ email: email }, process.env.JWT_OTP_SECRET_KEY!, { expiresIn: '1h' });
            return token;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}
