import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import decodedUser from "../interfaces/IDecodeUser";
import { container } from "../config/inversify/inversify";
import { IMiddlewareService } from "../services/interfaces/IMiddlewareService";
import { UnauthorizedError } from "teamsync-common";

const middlewareService = container.get<IMiddlewareService>("IMiddlewareService")

export default async (req: Request & Partial<{ user: Partial<decodedUser> }>, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        if (token) {
            const { userObj, decode } = await middlewareService.userApiAuth(token)
            req.user = userObj
            req.user.decode = decode
        } else {
            throw new UnauthorizedError()
        }

    }
    catch (error: any) {
        console.log(error);
        if (error.message === 'jwt expired' || error.message === 'jwt malformed' || error.message === 'invalid signature')
            next(new UnauthorizedError())
        else
            next(error);
    }

}

