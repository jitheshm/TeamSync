import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserRepository from "../../repository/implementations/UserRepository";
import { generateAccessToken } from "../../utils/token";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import AdminRepository from "../../repository/implementations/adminRepository";

const REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET as string;

export default async (req: Request, res: Response) => {

    const { refreshToken }: { refreshToken: string } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload: jwt.JwtPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;


        const data = { name: payload.name }

        const newAccessToken = generateAccessToken(data);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}