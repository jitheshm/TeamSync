import { inject, injectable } from "inversify";
import IAdminController from "../interfaces/IAdminController";
import { IAdminService } from "../../../services/interfaces/IAdminService";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { FValidationError } from "../../../errors/ValidationError";

@injectable()
export class AdminController implements IAdminController {
    private adminService: IAdminService;

    constructor(@inject("IAdminService") adminService: IAdminService) {
        this.adminService = adminService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {

            const result = validationResult(req);
            if (!result.isEmpty()) {
                throw new FValidationError(result.array(), 400);
            }

            const { user_name, password }: { user_name: string, password: string } = req.body;
            const { accessToken, refreshToken } = await this.adminService.login(user_name, password);
            res.status(200).json({ message: "admin verified", accessToken, refreshToken });
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}