import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserRepository from '../../repository/implementations/UserRepository';
import { KafkaConnection } from '../../config/kafka/KafkaConnection';
import { UserService } from '../../services/implementations/UserService';
import Jwt from 'jsonwebtoken';
import { IUserService } from '../../services/interfaces/IUserService';
import { IKafkaConnection } from '../../interfaces/IKafkaConnection';
import { IUserRepository } from '../../repository/interface/IUserRepository';

const userRepository:IUserRepository = new UserRepository();
const kafkaConnection:IKafkaConnection = new KafkaConnection();
const userService:IUserService = new UserService({ userRepository, kafkaConnection });

export default async (req: Request & Partial<{ user: Jwt.JwtPayload }>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { new_password }: { new_password: string } = req.body;
        const email = req.user?.email;

        const updatedUser = await userService.updateUserPassword(email!, new_password);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
