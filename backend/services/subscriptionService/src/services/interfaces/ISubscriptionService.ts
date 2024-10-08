import mongoose from "mongoose"
import Stripe from "stripe"
import ISubscriptions from "../../entities/SubscriptionEntity"

export interface ISubscriptionService {
    cancelSubscription(subscriptionId: string): Promise<any>
    createSubscription(customerId: string, planId: string, tenantId: string, userId: mongoose.Types.ObjectId): Promise<Stripe.Response<Stripe.Subscription>>
    fetchSubscriptionDetails(userId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>
    getAllSubscription(page: number, limit: number, name: string | null): Promise<{
        data: any[];
        total: any;
    }>
    updateSubscription(customerId: string, subscriptionId: string, planId: string): Promise<Stripe.Response<Stripe.Subscription>>
    getUserSubscription(userId: mongoose.Types.ObjectId): Promise<ISubscriptions | null>
    fetchPlanStats(): Promise<any[]>
    fetchProfit(): Promise<{
        total_earned: number;
    }>
    paymentRetry(invoiceId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>
    webhookHandler(sig: string | string[] | Buffer, bodyObj: any): Promise<void>
}