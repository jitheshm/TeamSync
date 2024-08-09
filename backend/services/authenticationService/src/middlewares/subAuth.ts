import { NextFunction, Request, Response } from "express";
import decodedUser from "../interfaces/IDecodeUser";


export default async (req: Request & Partial<{ user: Partial<decodedUser>}>, res: Response, next: NextFunction) => {
    try {
        

    }
    catch (error: any) {

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." })
    }

}

