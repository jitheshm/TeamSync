import { NextFunction, Request, Response } from "express";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IBranchRepository } from "../repository/interfaces/IBranchRepository";
import BranchRepository from "../repository/implementations/BranchRepository";
import { ISubscriptionRepository } from "../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../repository/implementations/SubscriptionRepository";

let tenantRepository: ITenantRepository = new TenantRepository()
let branchRepository: IBranchRepository = new BranchRepository()
let subscriptionRepository:ISubscriptionRepository = new SubscriptionRepository()
export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }
        const tenant = await tenantRepository.getTenantById(req.user?.decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        const subscriptionData = await subscriptionRepository.fetchSubscription(new mongoose.Types.ObjectId(req.user?.decode?.tenantId));

        if (!subscriptionData) return res.status(401).json({ error: "Unauthorized" });
        if (subscriptionData.status !== 'paid') return res.status(403).json({ error: "Company account suspended" });

        console.log(req.params.branchId);

        if (!req.body.branch_id) {
            if (req.params.branchId) {
                req.body.branch_id = req.params.branchId
            }
        }
        console.log(req.body);

        console.log(req.body.branch_id, req.user?.decode?.branchId);
        
        if (req.body.branch_id || req.user?.decode?.branchId) {
            let branchId = req.body.branch_id ? req.body.branch_id : req.user?.decode?.branchId
            const branch = await branchRepository.fetchBranchById(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(branchId))
            if (branch) {
                next()
            } else {
                return res.status(404).json({ error: "Branch not found" });
            }
        }
        else {
            return res.status(400).json({ error: "Branch ID not found" });
        }

    }
    catch (error: any) {

    }

}

