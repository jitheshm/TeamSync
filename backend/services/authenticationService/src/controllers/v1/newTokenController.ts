import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserRepository from "../../repository/implementations/UserRepository";
import { generateAccessToken } from "../../utils/token";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const userRepository = new UserRepository()
export default async (req: Request, res: Response) => {

    const { refreshToken }: { refreshToken: string } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload: jwt.JwtPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;

        const userData = await userRepository.fetchUser(payload.email);
        if (!userData) return res.status(401).json({ error: "Unauthorized" });
        if(userData.is_blocked) return res.status(403).json({ error: "User is blocked" });
        if(!userData.is_verified) return res.status(403).json({ error: "User not verified", verified: false });
        if(userData.role !== 'Tenant_Admin') return res.status(401).json({ error: "Unauthorized" });
        if(userData.subscribtion[0].status !== 'paid') return res.status(403).json({ error: "Account suspended" });

        const data = {
            email: payload.email,
            name: payload.first_name,
            id: payload.id,
            tenantId: payload.tenantId,
            role: payload.role
        }

        const newAccessToken = generateAccessToken(data);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}