import { Request, Response } from "express";
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth'
import { IUserRepository } from "../../repository/interface/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUsers } from "../../entities/UserEntity";
import UserProducer from "../../events/kafka/producers/UserProducer";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

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

const userRepository: IUserRepository = new UserRepository();
let kafkaConnection: IKafkaConnection = new KafkaConnection()

export default async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const auth = getAuth(app);
        const decodedToken = await auth.verifyIdToken(req.body.token);
        let userExist = await userRepository.fetchUserByAuthId(decodedToken.uid)
        if (!userExist) {
            if (decodedToken.firebase.sign_in_provider === 'google.com') {
                userExist = await userRepository.fetchUser(decodedToken.email as string)

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


                userExist = await userRepository.create(newUser)


                let producer = await kafkaConnection.getProducerInstance()
                let userProducer = new UserProducer(producer, 'main', 'users')
                userProducer.sendMessage('create', userExist)




            }
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
        }
        const token = jwt.sign({ email: decodedToken.email ?? "", name: decodedToken.name, id: userExist._id, tenantId: userExist?.tenant?.[0]?._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: "User verified", verified: true, token: token, name: decodedToken.name, tenantId: userExist?.tenant?.[0]?._id,role:'Tenant_Admin', id: userExist._id});


    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
};