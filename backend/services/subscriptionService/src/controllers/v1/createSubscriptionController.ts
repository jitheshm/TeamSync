import Stripe from "stripe";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import mongoose, { Mongoose } from "mongoose";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import SubscriptionProducer from "../../events/kafka/producers/SubscriptionProducer";
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository();
const kafkaConnection = new KafkaConnection()

export default async (subscription: Stripe.Subscription, planId: string, tenantId: string, userId: mongoose.Types.ObjectId) => {
    const subObj = {
        subscription_id: '#sub' + new Date().getTime() + Math.floor(Math.random() * 1000),
        stripe_subscription_id: subscription.id,
        tenant_id: new mongoose.Types.ObjectId(tenantId),
        plan_id: planId,
        user_id: userId,
        stripe_latest_invoice: (subscription.latest_invoice as Stripe.Invoice).id,
        stripe_customer_id: subscription.customer as string,
        status: 'pending',
        payment_method: "card",
        renewal_date: new Date(subscription.current_period_end * 1000),

    }
    console.log(subObj);

    const saveData = await subscriptionRepository.create(subObj)

    let producer = await kafkaConnection.getProducerInstance()
    let subscriptionProducer = new SubscriptionProducer(producer, 'main', 'subscription')
    subscriptionProducer.sendMessage('create', saveData)



}