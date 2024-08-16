import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { container } from "../config/inversify/inversify";
import { IMiddlewareService } from "../services/interfaces/IMiddlewareService";


const middlewareService = container.get<IMiddlewareService>("IMiddlewareService")

export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        const decode = req.user?.decode
        const body = req.body
        const params = req.params
        await middlewareService.tenantAuth(decode, body, params)
        next()

    }
    catch (error: any) {
        console.log(error)
        next(error);

    }

}

