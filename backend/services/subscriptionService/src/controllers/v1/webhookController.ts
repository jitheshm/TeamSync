import { Request, Response } from "express";
import Stripe from "stripe";
import createSubscriptionController from "./createSubscriptionController";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const endpointSecret = process.env.ENDPOINT_SECRET as string;

const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository


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

        case 'customer.subscription.deleted': {
            const eventObj = event.data.object
            console.log(eventObj);
            console.log('customer.subscription.deleted captured');


            const dataObj = {
                stripe_subscription_id: eventObj.id as string,
                status: "cancelled",
                cancel_date: new Date()
            }
            subscriptionRepository.update(dataObj)

            break;
        }

        case 'invoice.created':
            {
                const eventObj = event.data.object
                console.log(eventObj);
                console.log("invoice created event captures");

                const dataObj = {
                    stripe_subscription_id: eventObj.subscription as string,
                    status: "pending",
                    stripe_latest_invoice: eventObj.id
                }
                subscriptionRepository.update(dataObj)
            }
            break;
        case 'invoice.payment_succeeded':
            {
                const eventObj = event.data.object
                console.log(eventObj);
                console.log("invoice.payment_succeeded captured");

                const dataObj = {
                    stripe_subscription_id: eventObj.subscription as string,
                    status: "paid"
                }
                subscriptionRepository.update(dataObj)
            }

            break;
        case 'invoice.payment_failed':
            {
                const eventObj = event.data.object
                console.log(eventObj);
                console.log("invoice.payment_failed captured");

                const dataObj = {
                    stripe_subscription_id: eventObj.subscription as string,
                    status: "failed"
                }
                subscriptionRepository.update(dataObj)
            }
            break;

        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
}