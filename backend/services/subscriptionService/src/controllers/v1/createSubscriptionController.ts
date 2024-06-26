import Stripe from "stripe";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import mongoose from "mongoose";
const subscriptionRepository: ISubscriptionRepository = new SubscriptionRepository();

export default async (subscription: Stripe.Subscription, planId: string, tenantId: string) => {
    const subObj = {
        subscription_id: '#sub' + new Date().getTime() + Math.floor(Math.random() * 1000),
        stripe_subscription_id: subscription.id,
        tenant_id: new mongoose.Types.ObjectId(tenantId),
        plan_id: planId,
        stripe_latest_invoice: (subscription.latest_invoice as Stripe.Invoice).id,
        stripe_customer_id: subscription.customer as string,
        status: 'pending',
        payment_method: "card",
        renewal_date: new Date(subscription.current_period_end * 1000)

    }
    console.log(subObj);

    await subscriptionRepository.create(subObj)

}