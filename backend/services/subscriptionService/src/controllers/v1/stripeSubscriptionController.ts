import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import createSubscriptionController from "./createSubscriptionController";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response) => {
    let customerId = req.user?.stripe_customer_id
    let planId = req.body.plan_id
    let tenantId=req.body.tenantId
    let userId=req.user?._id
    console.log(customerId,planId,tenantId,userId);
    

    try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: planId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });
        console.log(subscription);
        await createSubscriptionController(subscription,planId,tenantId,userId)
        
        res.json(subscription);

    } catch (error: any) {
        return res.status(400).send({ error: { message: error.message } });
    }



}