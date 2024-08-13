import { inject, injectable } from "inversify";
import { IUserService } from "../../../services/interfaces/IUserService";
import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../../../errors/InternalServerError";
import IUserController from "../interfaces/IUserController";

@injectable()
export class UserController implements IUserController {
    private userService: IUserService;

    constructor(@inject("IUserService") userService: IUserService) {
        if (!userService) {
            console.log("UserController: userService is null or undefined");
        }
        this.userService = userService;
    }

    async firebaseLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.body?.token as string
            if (!token)
                throw new InternalServerError()
            const { accessToken, refreshToken, decodedToken, userExist } = await this.userService.firebaseLogin(req.body.token)
            res.status(200).json({ message: "User verified", verified: true, accessToken, refreshToken, name: decodedToken.name, tenantId: userExist?.tenant?.[0]?._id, role: 'Tenant_Admin', id: userExist._id });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body?.email as string
            await this.userService.forgetPassword(email)
            res.status(200).json({ message: "OTP sent successfully" });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { accessToken, refreshToken, userData } = await this.userService.login(req.body.email as string, req.body.password as string)
            res.status(200).json({ message: "User verified", verified: true, accessToken, refreshToken, name: userData.first_name, tenantId: userData?.tenant?.[0]?._id, role: 'Tenant_Admin', id: userData._id });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

}