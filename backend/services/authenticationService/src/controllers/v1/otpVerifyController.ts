import { validationResult } from "express-validator";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import UserProducer from "../../events/kafka/producers/UserProducer";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import jwt from 'jsonwebtoken';

const otpRepo: IOtpRepository = new OtpRepository();
const userRepository: IUserRepository = new UserRepository()
let kafkaConnection: IKafkaConnection = new KafkaConnection()


export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, otp, context }: { email: string, otp: string, context: string } = req.body;
        const otpExist = await otpRepo.fetchOtp(email);
        if (!otpExist) {
            return res.status(404).json({ error: "Otp not found" });
        }
        if (otpExist.context !== context) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        }
        if (otpExist.otp !== otp) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        } else {
            if (context === 'signup') {

                const userObj = await userRepository.verifyUser(email)
                let producer = await kafkaConnection.getProducerInstance()
                let userProducer = new UserProducer(producer, 'main', 'users')
                userProducer.sendMessage('update', userObj)
                res.status(200).json({ message: "User verified successfully" });

            } else if (context === 'forgot-password') {

                if(!process.env.JWT_OTP_SECRET_KEY){
                    console.log("JWT_OTP_SECRET_KEY not found in .env file");
                    
                    return res.status(500).json({error:"An unexpected error occurred. Please try again later."})
                }

                const token = jwt.sign({ email:email}, process.env.JWT_OTP_SECRET_KEY, { expiresIn: '1h' });

                res.status(200).json({ message: "OTP verified successfully",token:token });
            }
        }
  

    } catch (error: any) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}