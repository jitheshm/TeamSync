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


        if (req.user?.decode?.role !== 'Tenant_Admin' && req.user?.decode?.role !== 'Manager') {
            console.log("first");

            return res.status(401).json({ error: "Unauthorized" });
        }
        if (req.user?.decode?.role === 'Manager' && (req.query.role === 'Manager' || !req.query.role)) {
            console.log("second");

            return res.status(401).json({ error: "Unauthorized" });
        }

        const role = req.query.role as string | null
        const name = req.query.name as string | null
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit|| 1000)
        let users = await userRepo.fetchTenantUsers(req.user?.decode?.tenantId, role, name, page, limit)
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