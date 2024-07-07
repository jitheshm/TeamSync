import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');

        if (token) {

            if (!process.env.JWT_OTP_SECRET_KEY)
                throw new Error('JWT_Admin_SECRET_KEY not found in .env file');

            const decode = jwt.verify(token, process.env.JWT_OTP_SECRET_KEY) as JwtPayload;

            console.log(decode);
            if (decode) {
                req.user = decode
                next()
            } else {
                res.status(401).json({ error: "unauthorised" })
            }
        } else {
            res.status(401).json({ error: "unauthorised" })
        }

    }
    catch (error: any) {
        console.log(error);
        if (error.message === 'jwt expired' || error.message === 'jwt malformed'|| error.message === 'invalid signature')
            return res.status(401).json({ error: "Token expired or Invalid" });

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }

}

