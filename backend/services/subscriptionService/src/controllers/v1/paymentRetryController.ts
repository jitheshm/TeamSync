import { Request, Response } from "express";
import mongoose from 'mongoose';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async (req: Request, res: Response) => {
    try {

        const invoiceId = req.body.invoiceId as string;
        const invoice = await stripe.invoices.retrieve(invoiceId);
        if (invoice.status === 'paid') {
            return res.status(400).json({ error: "Invoice has already been paid." });
        }
        if(invoice.status==='open'){
            const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent as string)
            if(paymentIntent.status==='succeeded'){
                return res.status(400).json({ error: "Invoice has already been paid." });
            }
             res.status(200).json({ paymentIntent });
        }
        else{
            res.status(400).json({ error: "Invoice is not open." });
        }
        


    } catch (error: any) {
        console.log(error)

        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}