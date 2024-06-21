import { Request, Response } from "express";
import PlanRepository from "../../repository/implementations/PlanRepository";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import jwt from 'jsonwebtoken';


const planRepository: IPlanRepository = new PlanRepository();


export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response) => {
    try {

        const plans = await planRepository.fetchAll();

        res.status(200).json({ data: plans });


    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}