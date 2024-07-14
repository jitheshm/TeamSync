import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TenantUserRepository from '../../repository/implementations/TenantUserRepository';
import TenantUserService from '../../services/implementations/TenantUserService';
import { ITenantUserRepository } from '../../repository/interface/ITenantUserRepository';
import ITenantUserService from '../../services/interfaces/ITenantUserService';

const tenantUserRepository:ITenantUserRepository = new TenantUserRepository();
const tenantUserService:ITenantUserService = new TenantUserService({tenantUserRepository});

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, tenantId }: { email: string, tenantId: string } = req.body;

        await tenantUserService.sendOtpAndVerifyTenantUser(email, tenantId, 'tenant_login');

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error: any) {
        console.log(error);
        const status = error.status || 500;
        const message = error.message || "An unexpected error occurred. Please try again later.";
        res.status(status).json({ error: message });
    }
};
