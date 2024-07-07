import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserRepository from "../../repository/implementations/UserRepository";
import { generateOtp, sendOtp } from "../../utils/otp";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import OtpProducer from "../../events/kafka/producers/OtpProducer";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";

const userRepository: IUserRepository = new UserRepository();
const otpRepository: IOtpRepository = new OtpRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request, res: Response) => {

    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email }: { email: string } = req.body;

        const userData = await userRepository.fetchUser(email);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        if (userData.is_blocked) {
            return res.status(403).json({ error: "User is blocked" });
        }

        sendOtp(email, 'forgot-password')


        res.status(200).json({ message: "OTP sent successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}