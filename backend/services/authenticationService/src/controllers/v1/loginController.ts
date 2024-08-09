import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserRepository from "../../repository/implementations/UserRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

const userRepository: IUserRepository = new UserRepository();

export default async (req: Request, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }


        const { email, password }: { email: string, password: string } = req.body;
        const userData = await userRepository.fetchUser(email);


        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        const resObj = await bcrypt.compare(password, userData.password)

        if (!resObj) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        if (userData.is_blocked) {
            return res.status(403).json({ error: "User is blocked" });
        }
        if (!userData.is_verified) {
            return res.status(403).json({ error: "User not verified", verified: false });
        }
        if (userData.subscription?.[0]?.status !== 'paid') {
            return res.status(403).json({ error: "Account suspended" });
        } 

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
        }


        const accessToken = generateAccessToken({ email: userData.email, name: userData.first_name, id: userData._id, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        const refreshToken = generateRefreshToken({ email: userData.email, name: userData.first_name, id: userData._id, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin' })
        res.status(200).json({ message: "User verified", verified: true, accessToken, refreshToken, name: userData.first_name, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin', id: userData._id });



    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}