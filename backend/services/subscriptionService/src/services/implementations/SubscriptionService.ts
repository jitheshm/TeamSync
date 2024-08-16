import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";
import Stripe from "stripe";
import mongoose from "mongoose";
import SubscriptionProducer from "../../events/kafka/producers/SubscriptionProducer";
import { IKafkaConnection, IProducer } from "teamsync-common";
import ISubscriptions from "../../entities/SubscriptionEntity";
import { Producer } from "kafkajs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

@injectable()
export class SubscriptionService implements ISubscriptionService {
    private subscriptionRepository: ISubscriptionRepository;
    private kafkaConnection: IKafkaConnection
    private createSubscriptionProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<ISubscriptions>>;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ISubscriptionProducer") createSubscriptionProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<ISubscriptions>>
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.kafkaConnection = kafkaConnection
        this.createSubscriptionProducer = createSubscriptionProducer
    }

    async cancelSubscription(subscriptionId: string) {
        const subscription = await stripe.subscriptions.cancel(
            subscriptionId,
        )
        return subscription;
    }

    async createSubscription(customerId: string, planId: string, tenantId: string, userId: mongoose.Types.ObjectId) {
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

        const saveData = await this.subscriptionRepository.create(subObj)

        let producer = await this.kafkaConnection.getProducerInstance()
        let subscriptionProducer = this.createSubscriptionProducer(producer, 'main', 'subscription')
        subscriptionProducer.sendMessage('create', saveData)
        return subscription;
    }

    async fetchSubscriptionDetails(userId: mongoose.Types.ObjectId) {
        let data = await this.subscriptionRepository.findSubscriptionByUserId(userId)
        return data
    }

    async getAllSubscription(page: number, limit: number, name: string | null) {
        const subscriptions = await this.subscriptionRepository.fetchAllSubscriptions(name, page, limit)
        return subscriptions
    }

    async updateSubscription(customerId: string, subscriptionId: string, planId: string) {
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
        const result = await this.subscriptionRepository.update(dataObj)


        if (result) {
            let producer = await this.kafkaConnection.getProducerInstance()
            let subscriptionProducer = new SubscriptionProducer(producer, 'main', 'subscription')
            subscriptionProducer.sendMessage('update', result)
        }
        return subscription
    }

    async getUserSubscription(userId: mongoose.Types.ObjectId) {
        let data = await this.subscriptionRepository.findSubscriptionByUserId(userId)
        return data
    }

    async fetchPlanStats() {
        const result = await this.subscriptionRepository.fetchPlanStats()
        return result
    }

    async fetchProfit() {
        const result = await this.subscriptionRepository.fetchMonthlyProfit()
        return result
    }
}