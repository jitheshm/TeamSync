import { Request, Response } from "express";
import { validationResult } from "express-validator";
import IPlan from "../../entities/PlanEntity";
import PlanRepository from "../../repository/implementations/PlanRepository";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import mongoose, { Document } from 'mongoose';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const planRepository: IPlanRepository = new PlanRepository();

const updateStripePlan = async (plan: IPlan & Document) => {
    const product = await stripe.products.update(
        plan.stripe_plan_id,
        {
            name: plan.name,

        }
    );
}

export default async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: Partial<IPlan> = req.body;

       const {price,currency,bill_cycle,...dataObj}=bodyObj

        const id = new mongoose.Types.ObjectId(req.params.planId);
        let resObj = await planRepository.update(dataObj, id);
        if (!resObj)
            return res.status(404).json({ message: "Plan not found" });

        // updateStripePlan(resObj) 

        res.status(200).json({ message: "Plan updated successfully" });

    } catch (error: any) {
        console.log(error)

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}