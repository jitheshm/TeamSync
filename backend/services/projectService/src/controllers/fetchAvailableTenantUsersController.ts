import { Request, Response } from "express";
import mongoose from "mongoose";
import { ITenantUserRepository } from "../repository/interfaces/ITenantUserRepository";
import TenantUserRepository from "../repository/implementations/TenantUserRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import IDecodedUser from "../interfaces/IDecodeUser";


let userRepo: ITenantUserRepository = new TenantUserRepository()
let tenantRepository: ITenantRepository = new TenantRepository()

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        if (!req.user?.decode?.tenantId) {
            return res.status(400).json({ error: "Tenant ID not found" });
        }
        const tenant = await tenantRepository.getTenantById(req.user?.decode?.tenantId)
        console.log(tenant);

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }


        if (req.user?.decode?.role !== 'Tenant_Admin' && req.user?.decode?.role !== 'Manager') {
            console.log("first");

            return res.status(401).json({ error: "Unauthorized" });
        }
        if (req.user?.decode?.role === 'Manager' && (req.query.role === 'Manager' || !req.query.role)) {
            console.log("second");

            return res.status(401).json({ error: "Unauthorized" });
        }

        const role = req.query.role as string 
        let users = await userRepo.fetchAvailableTenantUsers(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.user?.decode?.branchId), role)
        if (users) {
            res.status(200).json({ data: users })
        } else {
            res.status(404).json({ error: "User not found" })

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}