import { Request, Response } from "express";
import Stripe from "stripe";
import createSubscriptionController from "./createSubscriptionController";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const endpointSecret = process.env.ENDPOINT_SECRET as string;


export default (request: Request, response: Response) => {
    const sig = request.headers['stripe-signature'] as string | string[] | Buffer;

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err: any) {
        console.log(err);
        
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {

        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log('worked>>>>>>>>>>>>>>>>');
            
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}