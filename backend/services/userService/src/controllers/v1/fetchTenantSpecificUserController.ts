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

       
        let users = await userRepo.fetchTenantSpecificUser(req.user?.decode?.tenantId, new mongoose.Types.ObjectId(req.params.userId))
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