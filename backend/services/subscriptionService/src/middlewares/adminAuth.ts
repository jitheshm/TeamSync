import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IMiddlewareService } from "../services/interfaces/IMiddlewareService";
import { container } from "../config/inversify/inversify";

const middlewareService = container.get<IMiddlewareService>("IMiddlewareService")

export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        if (token) {
            const decode = await middlewareService.adminApiAuth(token)
            req.user = decode
            next()
        } else {
            res.status(401).json({ error: "unauthorised" })
        }

    }
    catch (error: any) {
        console.log(error);
        if (error.message === 'jwt expired' || error.message === 'jwt malformed' || error.message === 'invalid signature')
            return res.status(401).json({ error: "Token expired or Invalid" });

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }

}

