import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from "teamsync-common";


export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        if (token) {

            if (!process.env.JWT_OTP_SECRET_KEY) {
                console.log("JWT_OTP_SECRET_KEY not found in .env file");
                throw new UnauthorizedError()

            }

            const decode = jwt.verify(token, process.env.JWT_OTP_SECRET_KEY) as JwtPayload;

            console.log(decode);
            if (decode) {
                req.user = decode
                next()
            } else {
                throw new UnauthorizedError()

            }
        } else {
            throw new UnauthorizedError()
        }

    }
    catch (error) {
        console.log(error)
        next(new UnauthorizedError())
    }

}

