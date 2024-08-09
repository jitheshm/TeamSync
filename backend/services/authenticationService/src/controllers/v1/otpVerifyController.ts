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
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import mongoose from "mongoose";
import { ISubscriptionRepository } from "../../repository/interface/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";

const otpRepo: IOtpRepository = new OtpRepository();
const userRepository: IUserRepository = new UserRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()
const tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
const subscriptionRepository:ISubscriptionRepository = new SubscriptionRepository()

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
                res.status(200).json({ message: "User verified successfully", verified: true, token: token, name: userObj.first_name, role: 'Tenant_Admin', id: userObj._id });

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

                const subscriptionData = await subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(tenantId));

                if (!subscriptionData) return res.status(401).json({ error: "Unauthorized" });
                if (subscriptionData.status !== 'paid') return res.status(403).json({ error: "Company account suspended" });

                const userObj = await tenantUserRepository.fetchSpecificUser(tenantId, email);



                if (!userObj) {
                    return res.status(401).json({ error: "Invalid email address" });
                }

                if (!process.env.JWT_SECRET_KEY) {
                    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
                }

                

                const accessToken = generateAccessToken({ email: email, name: userObj.name, id: userObj._id, tenantId: tenantId, role: userObj.role, branchId: userObj.branch_id })
                const refreshToken = generateRefreshToken({ email: email, name: userObj.name, id: userObj._id, tenantId: tenantId, role: userObj.role, branchId: userObj.branch_id })
                res.status(200).json({ message: "User verified", verified: true, accessToken, refreshToken, name: userObj.name, tenantId: tenantId, role: userObj.role, id: userObj._id });
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