import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import createSubscriptionController from "./createSubscriptionController";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response) => {
    let subscriptionId = req.params.subscriptionId as string


    try {
        const subscription = await stripe.subscriptions.cancel(
            subscriptionId,
        )
        res.json(subscription);

    } catch (error: any) {
        return res.status(400).send({ error: { message: error.message } });
    }



}