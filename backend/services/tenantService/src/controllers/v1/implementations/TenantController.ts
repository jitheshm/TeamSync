import { inject, injectable } from "inversify";
import { ITenantController } from "../interfaces/ITenantController";
import { ITenantService } from "../../../services/interfaces/ITenantService";
import { NextFunction, Response } from "express";
import { CustomError, CustomRequest } from "teamsync-common";
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

    async fetchSpecificTenant(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            let tenantName = req.params.name
            if (!tenantName) {
                throw new CustomError("Tenant name is required", 400)
            }
            const data = await this.tenantService.fetchSpecificTenant(tenantName)

            if (data) {
                res.status(200).json({ message: "Tenant fetched successfully", data: data })
            } else {
                throw new CustomError("Tenant not found", 404)
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}