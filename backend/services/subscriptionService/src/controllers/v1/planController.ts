import { Request, Response } from "express";
import { validationResult } from "express-validator";
import IPlan from "../../entities/PlanEntity";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanRepository from "../../repository/implementations/PlanRepository";
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const planRepository: IPlanRepository = new PlanRepository();

const createStripePlan = async (plan: IPlan) => {
    const stripePlan = await stripe.plans.create({
        amount: Number(plan.price)*100,
        interval: plan.bill_cycle,
        product: {
            name: plan.name,
        },
        currency: 'usd',
    });
    console.log(stripePlan); 
    
    return stripePlan.product

}

export default async (req: Request & Partial<{ user: string | jwt.JwtPayload }>, res: Response) => {
    try {
 
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const bodyObj: IPlan = req.body;
        bodyObj.plan_id = '#plan' + new Date().getTime() + Math.floor(Math.random() * 1000)
        const stripePlanId =await createStripePlan(bodyObj)
        bodyObj.stripe_plan_id=stripePlanId as string
        await planRepository.create(bodyObj);

        res.status(201).json({ message: "Plan created successfully" });




    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}