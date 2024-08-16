import mongoose from "mongoose"
import Stripe from "stripe"

export interface ISubscriptionService {
    cancelSubscription(subscriptionId: string): Promise<any>
    createSubscription(customerId: string, planId: string, tenantId: string, userId: mongoose.Types.ObjectId): Promise<Stripe.Response<Stripe.Subscription>>
}