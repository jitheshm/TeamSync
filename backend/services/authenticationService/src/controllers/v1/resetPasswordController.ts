import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserRepository from "../../repository/implementations/UserRepository";
import bcrypt from "../../utils/bcrypt";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import UserProducer from "../../events/kafka/producers/UserProducer";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";

const userRepository:IUserRepository = new UserRepository();
let kafkaConnection:IKafkaConnection = new KafkaConnection()


export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { email, new_password }: { email: string, new_password: string } = req.body;
        const password = bcrypt(new_password)
        const updateUserObj = await userRepository.updateUser({ email: email, password: password })

        if (!updateUserObj) {
            return res.status(404).json({ error: "User not found" });
        } else {
            let producer = await kafkaConnection.getProducerInstance()
            let userProducer = new UserProducer(producer, 'main', 'users')
            userProducer.sendMessage('update', updateUserObj)
            res.status(200).json({ message: "Password updated successfully" });
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}