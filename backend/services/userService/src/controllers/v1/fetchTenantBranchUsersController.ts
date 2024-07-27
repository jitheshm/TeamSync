import { Request, Response } from "express";
import mongoose from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";

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

        const branchId = new mongoose.Types.ObjectId(req.user?.decode?.branchId as string)
        let users = await userRepo.fetchTenantBranchUsers(req.user?.decode?.tenantId, branchId)

        res.status(200).json({ data: users })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }
}