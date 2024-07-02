import { NextFunction, Request, Response } from "express";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import jwt from "jsonwebtoken";

let tenantRepository: ITenantRepository = new TenantRepository()
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
        next()

    }
    catch (error: any) {

    }

}

