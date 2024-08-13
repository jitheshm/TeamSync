import { inject, injectable } from "inversify";
import IAdminController from "../interfaces/IAdminController";
import { IAdminService } from "../../../services/interfaces/IAdminService";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../errors/Unauthorized";


@injectable()
export class AdminController implements IAdminController {
    private adminService: IAdminService;

    constructor(@inject("IAdminService") adminService: IAdminService) {
        if (!adminService) {
            console.log("AdminController: adminService is null or undefined");
        }

        this.adminService = adminService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {

            const { user_name, password }: { user_name: string, password: string } = req.body;
            const { accessToken, refreshToken } = await this.adminService.login(user_name, password);
            res.status(200).json({ message: "admin verified", accessToken, refreshToken });

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    async newToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken }: { refreshToken: string } = req.body;
            if (!refreshToken)
                throw new UnauthorizedError()
            const accessToken=this.adminService.newToken(refreshToken)
            res.status(200).json({accessToken: accessToken})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}