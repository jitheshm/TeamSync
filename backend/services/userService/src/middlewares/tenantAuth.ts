import { NextFunction, Request, Response } from "express";
import { ITenantRepository } from "../repository/interface/ITenantRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IBranchRepository } from "../repository/interface/IBranchRepository";
import BranchRepository from "../repository/implementations/BranchRepository";

let tenantRepository: ITenantRepository = new TenantRepository()
let branchRepository: IBranchRepository = new BranchRepository()
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

