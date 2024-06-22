import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ITenants } from "../../entities/TenantEntity";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import jwt from 'jsonwebtoken';
import { IUsers } from "../../entities/UserEntity";
import { Document } from "mongoose";

const tenantRepository: ITenantRepository = new TenantRepository();

export default async(req: Request & Partial<{ user:IUsers&Document}>, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: Partial<ITenants> = req.body;
        bodyObj.user_id = req.user?._id;
        bodyObj.tenant_id = '#tenant' + new Date().getTime() + Math.floor(Math.random() * 1000)
        await tenantRepository.create(bodyObj);
        res.status(201).json({ message: "Tenant created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }

}