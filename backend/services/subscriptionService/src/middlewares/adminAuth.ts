import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


export default async(req:Request & Partial<{user:string | jwt.JwtPayload}>, res:Response, next:NextFunction) => {
    try {
        const token = req.header('Authorization');
        
        if(token){

            if(!process.env.JWT_ADMIN_SECRET_KEY)
                throw new Error('JWT_Admin_SECRET_KEY not found in .env file');

            const decode = jwt.verify(token,process.env.JWT_ADMIN_SECRET_KEY);

            console.log(decode);
            if (decode ) {
                req.user = decode
                next()
            }else{
                res.status(401).json({error:"unauthorised"})
            }
        }else{
            res.status(401).json({error:"unauthorised"})
        }
        
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error:"An unexpected error occurred. Please try again later."})
    }

}

