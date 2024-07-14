import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserRepository from '../../repository/implementations/UserRepository';
import TenantUserRepository from '../../repository/implementations/TenantUserRepository';
import { UserService } from '../../services/implementations/UserService';
import TenantUserService from '../../services/implementations/TenantUserService';
import { IUserRepository } from '../../repository/interface/IUserRepository';
import { ITenantUserRepository } from '../../repository/interface/ITenantUserRepository';
import { IUserService } from '../../services/interfaces/IUserService';
import ITenantUserService from '../../services/interfaces/ITenantUserService';

const userRepository:IUserRepository = new UserRepository();
const tenantUserRepository:ITenantUserRepository = new TenantUserRepository();

const userService:IUserService = new UserService({ userRepository });
const tenantUserService:ITenantUserService = new TenantUserService({ tenantUserRepository });

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, context, tenantId }: { email: string, context: string, tenantId: string | null } = req.body;

        if (!tenantId) {
            await userService.sendOtpAndVerifyUser(email, context);
        } else {
            await tenantUserService.sendOtpAndVerifyTenantUser(email, tenantId, context);
        }

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
        console.log(error);
        const status = error.status || 500;
        const message = error.message || "An unexpected error occurred. Please try again later.";
        res.status(status).json({ error: message });
    }
};
