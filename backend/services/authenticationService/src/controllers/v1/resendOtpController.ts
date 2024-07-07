import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendOtp } from '../../utils/otp';
import { IUserRepository } from '../../repository/interface/IUserRepository';
import UserRepository from '../../repository/implementations/UserRepository';
import { ITenantUserRepository } from '../../repository/interface/ITenantUserRepository';
import TenantUserRepository from '../../repository/implementations/TenantUserRepository';

const userRepository: IUserRepository = new UserRepository();
const tenantUserRepository: ITenantUserRepository = new TenantUserRepository();

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, context, tenantId }: { email: string, context: string, tenantId: string | null } = req.body;

        if (!tenantId) {
            const userData = await userRepository.fetchUser(email);
            if (!userData) {
                return res.status(404).json({ error: "User not found" });
            }
            if (userData.is_blocked) {
                return res.status(403).json({ error: "User is blocked" });
            }
        } else {

            const userData = await tenantUserRepository.fetchSpecificUser(tenantId, email);


            if (!userData) {
                return res.status(401).json({ error: "Invalid email address" });
            }

            if (!process.env.JWT_SECRET_KEY) {
                return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
            }
        }


        sendOtp(email, context);
        res.status(200).json({ message: "OTP sent successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}