// src/controllers/userController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IKafkaConnection } from '../../interfaces/IKafkaConnection';
import { KafkaConnection } from '../../config/kafka/KafkaConnection';
import UserRepository from '../../repository/implementations/UserRepository';
import { IUserService } from '../../services/interfaces/IUserService';
import { UserService } from '../../services/implementations/UserService';

const userRepository = new UserRepository();
const kafkaConnection: IKafkaConnection = new KafkaConnection();
const userService: IUserService = new UserService({ userRepository, kafkaConnection });

export default async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token } = req.body;
        const decodedToken = await userService.verifyUserToken(token);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await userService.createUserFromFirebase(decodedToken);

        res.status(200).json({ message: 'User verified', verified: true, ...result });

    } catch (error) {
        console.error('Error in user controller:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};
