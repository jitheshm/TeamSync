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

     

        if (req.user?.decode?.role !== 'Tenant_Admin' && req.query.role !== 'Manager') {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (req.user?.decode?.role === 'Manager' && (req.query.role === 'Manager' || !req.query.role)) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const role = req.query.role as string | null
        let users = await userRepo.fetchTenantUsers(req.user?.decode?.tenantId, role)
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