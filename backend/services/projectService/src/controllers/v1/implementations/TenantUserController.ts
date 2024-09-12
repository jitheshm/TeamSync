import { inject, injectable } from "inversify";
import { ITenantUserService } from "../../../services/interfaces/ITenantUserService";
import { CustomRequest } from "teamsync-common";
import { NextFunction,Request,Response } from "express";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { ITenantUserController } from "../interfaces/ITenantUserController";


@injectable()
export class TenantUserController implements ITenantUserController {
    private tenantUserService: ITenantUserService;

    constructor(
        @inject("ITenantUserService") tenantUserService: ITenantUserService
    ) {
        this.tenantUserService = tenantUserService;

    }

    async fetchAvailableTenantUsers(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IDecodedUser;
            const role = req.query.role as string;


            const users = await this.tenantUserService.getAvailableTenantUsers(user, role);
            res.status(200).json({ data: users });


        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    

}