import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";

import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import UserRepository from "../../repository/implementations/UserRepository";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { UserService } from "../../services/implementations/UserService";
import OtpService from "../../services/implementations/OtpService";
import TenantAuthService from "../../services/implementations/TenantAuthService";

const kafkaConnection: IKafkaConnection = new KafkaConnection();
const userRepository: IUserRepository = new UserRepository();
const otpRepository: IOtpRepository = new OtpRepository();
const tenantUserRepository: ITenantUserRepository = new TenantUserRepository();

const userService = new UserService({ userRepository, kafkaConnection });
const otpService = new OtpService({ otpRepository });
const tenantAuthService = new TenantAuthService({ tenantUserRepository });

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { context, tenantId, email, otp }: { context: string; tenantId?: string; email: string; otp?: string } = req.body;

        const isOtpValid = await otpService.verifyOtp(email, otp!, context);

        if (!isOtpValid) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        }

        if (context === 'signup') {



            const tokenData = await userService.signup(email);
            if (!tokenData) {
                return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
            }
            res.status(200).json({ message: "User verified successfully", verified: true, ...tokenData, role: 'Tenant_Admin' });
            
        } else if (context === 'forgot-password') {

            const token = await userService.forgotPassword(email);
            res.status(200).json({ message: "OTP verified successfully", token });

        } else if (context === 'tenant_login') {
            if (!tenantId) {
                return res.status(400).json({ error: "Tenant ID is required" });
            }

            const tokenData = await tenantAuthService.tenantLogin(email, tenantId);
            if (!tokenData) {
                return res.status(401).json({ error: "Invalid email address or tenant ID" });
            }
            res.status(200).json({ message: "User verified", verified: true, ...tokenData });
        } else {
            res.status(400).json({ error: "Invalid context" });
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
