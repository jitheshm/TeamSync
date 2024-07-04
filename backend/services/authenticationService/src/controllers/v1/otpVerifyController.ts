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
import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";

const otpRepo: IOtpRepository = new OtpRepository();
const userRepository: IUserRepository = new UserRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()
const tenantUserRepository: ITenantUserRepository = new TenantUserRepository()

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, otp, context, tenantId }: { email: string, otp: string, context: string, tenantId: string | null } = req.body;
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

                if (!process.env.JWT_SECRET_KEY) {
                    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
                }

                const token = jwt.sign({ email: userObj.email, name: userObj.first_name, id: userObj._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ message: "User verified successfully", verified: true, token: token, name: userObj.first_name, role: 'Tenant_admin' });

            } else if (context === 'forgot-password') {

                if (!process.env.JWT_OTP_SECRET_KEY) {
                    console.log("JWT_OTP_SECRET_KEY not found in .env file");

                    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
                }

                const token = jwt.sign({ email: email }, process.env.JWT_OTP_SECRET_KEY, { expiresIn: '1h' });

                res.status(200).json({ message: "OTP verified successfully", token: token });

            } else if (context === 'tenant_login') {
                if (!tenantId) {
                    return res.status(400).json({ error: "Tenant ID is required" });
                }

                const userObj = await tenantUserRepository.fetchSpecificUser(tenantId, email);

                if (!userObj) {
                    return res.status(401).json({ error: "Invalid email address" });
                }

                if (!process.env.JWT_SECRET_KEY) {
                    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
                }

                const token = jwt.sign({ email: email, name: userObj.name, id: userObj._id, tenantId: tenantId, role: userObj.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ message: "User verified", verified: true, token: token, name: userObj.name, tenantId: tenantId, role: userObj.role });
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