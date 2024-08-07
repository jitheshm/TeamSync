import { Request, Response } from "express";
import PlanRepository from "../../repository/implementations/PlanRepository";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import jwt from 'jsonwebtoken';


const planRepository: IPlanRepository = new PlanRepository();


export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response) => {
    try {
        const { name, page, limit } = req.query
        let data
        if (page && limit) {
            data = await planRepository.fetchAvailablePlans(Number(page), Number(limit), name as string | null);

        } else
            data = await planRepository.fetchAvailablePlans(1, 100, null);

        res.status(200).json({ data: data });


    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}