import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserRepository from "../../repository/implementations/UserRepository";
import { generateOtp } from "../../services/otpService";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import OtpProducer from "../../events/kafka/producers/OtpProducer";

export default async (req: Request, res: Response) => {

    try {
        
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email }: { email: string } = req.body;
        const userRepository = new UserRepository();
        const userData = await userRepository.fetchUser(email);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        if (userData.is_blocked) {
            return res.status(403).json({ error: "User is blocked" });
        }

        const otp = generateOtp()
        const otpObj = {
            email: email,
            otp: `${otp}`,
            context: 'forget_password'
        }
        const otpRepository = new OtpRepository()
        await otpRepository.create(otpObj, email)


        const kafkaConnection = new KafkaConnection()
        let producer = await kafkaConnection.getProducerInstance()
        let otpProducer = new OtpProducer(producer, 'main', 'otps')
        otpProducer.sendMessage('create', otpObj)

        res.status(200).json({ message: "OTP sent successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}