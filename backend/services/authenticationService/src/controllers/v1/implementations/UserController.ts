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
            const { accessToken, refreshToken,decodedToken,userExist } = await this.userService.firebaseLogin(req.body.token)
            res.status(200).json({ message: "User verified", verified: true, accessToken, refreshToken, name: decodedToken.name, tenantId: userExist?.tenant?.[0]?._id, role: 'Tenant_Admin', id: userExist._id });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }
}