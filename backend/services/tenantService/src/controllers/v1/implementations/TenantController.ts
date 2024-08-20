import { inject, injectable } from "inversify";
import { ITenantController } from "../interfaces/ITenantController";
import { ITenantService } from "../../../services/interfaces/ITenantService";
import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";
import { ITenants } from "../../../entities/TenantEntity";

@injectable()
export class TenantController implements ITenantController {
    private tenantService: ITenantService

    constructor(
        @inject("ITenantService") tenantService: ITenantService
    ) {
        this.tenantService = tenantService
    }

    async createTenant(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const bodyObj: Partial<ITenants> = req.body;

            console.log(req.user);

            bodyObj.user_id = req.user?._id;
            console.log(bodyObj)
            const tenant = await this.tenantService.createTenant(bodyObj)
            res.status(201).json({ message: "Tenant created successfully", tenantId: tenant._id });

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}