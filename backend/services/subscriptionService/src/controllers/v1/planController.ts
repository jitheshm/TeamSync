import { Request, Response } from "express";
import { validationResult } from "express-validator";
import IPlan from "../../entities/PlanEntity";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanRepository from "../../repository/implementations/PlanRepository";
import jwt from 'jsonwebtoken';

const planRepository: IPlanRepository = new PlanRepository();


export default async (req: Request & Partial<{user:string | jwt.JwtPayload}>, res: Response) => {
    try {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: Partial<IPlan> = req.body;
        bodyObj.plan_id = '#plan' + new Date().getTime() + Math.floor(Math.random() * 1000)

        await planRepository.create(bodyObj);

        res.status(201).json({ message: "Plan created successfully" });




    } catch (error) {
            
            console.log(error);
            res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}