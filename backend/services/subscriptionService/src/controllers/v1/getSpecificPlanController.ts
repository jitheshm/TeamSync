import { Request, Response } from "express";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanRepository from "../../repository/implementations/PlanRepository";
import mongoose from "mongoose";

const planRepository: IPlanRepository = new PlanRepository();
export default async (req: Request, res: Response) => {

    try {
        const planId = new mongoose.Types.ObjectId(req.params.planId);
        
        if (plans) {
            res.status(200).json({ data: plans })
        }
        else {
            res.status(404).json({ message: "Plan not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}