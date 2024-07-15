import { Request, Response } from "express";
import TenantUserRepository from "../repository/implementations/TenantUserRepository";
import TenantRepository from "../repository/implementations/TenantRepository";
import { ITenantUserRepository } from "../repository/interfaces/ITenantUserRepository";
import { ITenantRepository } from "../repository/interfaces/ITenantRepository";
import IDecodedUser from "../interfaces/IDecodeUser";
import TenantService from "../services/implementations/TenantService";
import TenantUserService from "../services/implementations/TenantUserService";

const tenantUserRepository: ITenantUserRepository = new TenantUserRepository();
const tenantRepository: ITenantRepository = new TenantRepository();
const tenantService = new TenantService(tenantRepository);
const tenantUserService = new TenantUserService({tenantUserRepository, tenantService});

export default async (req: Request & Partial<{ user: IDecodedUser }>, res: Response) => {
    try {
        const user = req.user as IDecodedUser;
        const role = req.query.role as string;

        try {
            const users = await tenantUserService.getAvailableTenantUsers(user, role);
            res.status(200).json({ data: users });
        } catch (error:any) {
            if (error.message === "Tenant ID not found" || error.message === "Tenant not found") {
                return res.status(404).json({ error: error.message });
            } else if (error.message === "Unauthorized") {
                return res.status(401).json({ error: error.message });
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}
