import { validationResult } from "express-validator";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { Request, Response } from "express";
import UserRepository from "../../repository/implementations/UserRepository";


export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, otp, context }: { email: string, otp: string, context: string } = req.body;
        const otpRepo = new OtpRepository();
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
            const userRepository = new UserRepository()
            await userRepository.verifyUser(email)
            
            res.status(200).json({ message: "User verified successfully" });
        }


    } catch (error :any) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json({ error: error.message });
        }
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}