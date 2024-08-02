import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUsers } from "../../entities/UserEntity";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import UserProducer from "../../events/kafka/producers/UserProducer";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import Stripe from "stripe";

let userRepo: IUserRepository = new UserRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)


export default async (req: Request, res: Response) => {

    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        let user: IUsers = req.body;
        let userExist = await userRepo.fetchUserByEmail(user.email)
        if (userExist) {
            if (userExist.is_verified)
                return res.status(409).json({ error: "Email address already exists." })
            else {
                let producer = await kafkaConnection.getProducerInstance()
                let userProducer = new UserProducer(producer, 'main', 'users')
                userProducer.sendMessage('resendOtp', userExist)
                return res.status(200).json({ message: "otp send successfully" })


            }
        }


        user.password = bcrypt(user.password)
        user.user_id = '#user' + new Date().getTime() + Math.floor(Math.random() * 1000)

        const customer = await stripe.customers.create({
            email: user.email,
            name: user.first_name,

 
        });

        user.stripe_customer_id = customer.id

        const newUser = await userRepo.create(user)


        // send message to kafka

        let producer = await kafkaConnection.getProducerInstance()
        let userProducer = new UserProducer(producer, 'main', 'users')
        userProducer.sendMessage('create', newUser)



        res.status(201).json({ message: "user registered successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}