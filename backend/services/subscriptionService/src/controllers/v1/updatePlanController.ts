import { Request, Response } from "express";
import { validationResult } from "express-validator";
import IPlan from "../../entities/PlanEntity";
import PlanRepository from "../../repository/implementations/PlanRepository";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import mongoose from 'mongoose';

const planRepository: IPlanRepository = new PlanRepository();

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: Partial<IPlan> = req.body;
        const id = new mongoose.Types.ObjectId(req.params.planId);
        let resObj = await planRepository.update(bodyObj, id);
        if (resObj.modifiedCount === 0)
            return res.status(404).json({ message: "Plan not found" });

        res.status(200).json({ message: "Plan updated successfully" });

    } catch (error: any) {
        console.log(error)

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}