import { NextFunction, Request, Response } from "express";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ISubscriptionRepository } from "../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../repository/implementations/SubscriptionRepository";

let tenantRepository: ITenantRepository = new TenantRepository()
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository()

export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }
        console.log(req.user?.decode?.tenantId);

        const tenant = await tenantRepository.getTenantById(req.user?.decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        const subscriptionData = await subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(req.user?.decode?.tenantId));

        if (!subscriptionData) return res.status(401).json({ error: "Unauthorized" });
        if (subscriptionData.status !== 'paid') return res.status(403).json({ error: "Company account suspended" });

        next()

    }
    catch (error: any) {

    }

}

