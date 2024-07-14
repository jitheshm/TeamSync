// src/controllers/otpController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserRepository from '../../repository/implementations/UserRepository';
import OtpRepository from '../../repository/implementations/OtpRepository';
import { KafkaConnection } from '../../config/kafka/KafkaConnection';
import OtpService from '../../services/implementations/OtpService';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const kafkaConnection = new KafkaConnection();
const otpService = new OtpService({ userRepository, otpRepository, kafkaConnection });

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email }: { email: string } = req.body;

        await otpService.sendOtpForPasswordReset(email);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        } else if (error.message === 'User is blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
        }
    }
};
