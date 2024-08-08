import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AdminRepository from "../../repository/implementations/adminRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../../utils/adminToken";

let adminRepo: IAdminRepository = new AdminRepository()

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { user_name, password }: { user_name: string, password: string } = req.body;

        const adminObj = await adminRepo.fetchUser(user_name)
        if (!adminObj) {
            return res.status(401).json({ error: "Invalid user name or password" });
        }
        const resObj = await bcrypt.compare(password, adminObj.password)
        if (!resObj) {
            return res.status(401).json({ error: "Invalid user name or password" });
        }

        if (!process.env.JWT_ADMIN_SECRET_KEY) {
            return res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
        }
        const accessToken = generateAdminAccessToken({ name: 'admin' })
        const refreshToken = generateAdminRefreshToken({ name: 'admin' })
        res.status(200).json({ message: "admin verified", accessToken, refreshToken });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}