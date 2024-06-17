import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUsers } from "../../entities/UserEntity";
import bcrypt from "../../utils/bcrypt";
import { validationResult } from "express-validator";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import UserProducer from "../../events/kafka/producers/UserProducer";

export default async (req: Request, res: Response) => {

    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        let user: IUsers = req.body;
        let userRepo = new UserRepository()
        let userExist = await userRepo.fetchUserByEmail(user.email)
        if (userExist) {
            return res.status(409).json({ error: "Email address already exists." })
        }


        user.password = bcrypt(user.password)
        user.user_id = '#user' + new Date().getTime() + Math.floor(Math.random() * 1000)

        await userRepo.create(user)

        // send message to kafka
        
        let kafkaConnection = new KafkaConnection()
        let producer = await kafkaConnection.getProducerInstance()
        let userProducer = new UserProducer(producer, 'main', 'users')
        userProducer.sendMessage('create', user)



        res.status(201).json({ message: "user registered successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}