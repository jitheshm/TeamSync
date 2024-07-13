import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import createSubscriptionController from "./createSubscriptionController";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import SubscriptionProducer from "../../events/kafka/producers/SubscriptionProducer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository
const kafkaConnection = new KafkaConnection()
export default async (req: Request & Partial<{ user: jwt.JwtPayload }>, res: Response) => {


    try {

        let customerId = req.params.customerId as string
        let subscriptionId = req.params.subscriptionId as string
        let planId = req.body.plan_id as string

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
        });

        const subscription = await stripe.subscriptions.update(
            subscriptionId,
            {
                items: [
                    {
                        id: subscriptions.data[0].items.data[0].id,
                        price: planId,
                    },
                ],
            }
        );

        const dataObj = {
            stripe_subscription_id: subscriptionId as string,
            plan_id: planId


        }
        const result = await subscriptionRepository.update(dataObj)


        if (result) {
            let producer = await kafkaConnection.getProducerInstance()
            let subscriptionProducer = new SubscriptionProducer(producer, 'main', 'subscription')
            subscriptionProducer.sendMessage('update', result)
        }

        res.json(subscription);

    } catch (error: any) {
        return res.status(400).send({ error: { message: error.message } });
    }



}