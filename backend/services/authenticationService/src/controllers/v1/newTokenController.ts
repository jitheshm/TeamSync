import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserRepository from "../../repository/implementations/UserRepository";
import { generateAccessToken } from "../../utils/token";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import mongoose from "mongoose";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import { ISubscriptionRepository } from "../../repository/interface/ISubscriptionRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const userRepository: IUserRepository = new UserRepository()
const tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository()
export default async (req: Request, res: Response) => {

    const { refreshToken }: { refreshToken: string } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload: jwt.JwtPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;

        if (payload.role === 'Tenant_Admin') {
            const userData = await userRepository.fetchUser(payload.email);
            if (!userData) return res.status(401).json({ error: "Unauthorized" });
            if (userData.is_blocked) return res.status(403).json({ error: "User is blocked" });
            if (!userData.is_verified) return res.status(403).json({ error: "User not verified", verified: false });
        } else {

            const subscriptionData = await subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(payload.tenantId));

            if (!subscriptionData) return res.status(401).json({ error: "Unauthorized" });
            if (subscriptionData.status !== 'paid') return res.status(403).json({ error: "Company account suspended" });

            const userData = await tenantUserRepository.fetchSpecificUser(payload.tenantId, payload.email);
            if (!userData) return res.status(401).json({ error: "Unauthorized" });
            if (userData.is_deleted) return res.status(401).json({ error: "User is blocked" });

        }


        const data = {
            email: payload.email,
            name: payload.first_name,
            id: payload.id,
            tenantId: payload.tenantId,
            role: payload.role,
            branchId: payload.branchId??""
        }

        const newAccessToken = generateAccessToken(data);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}