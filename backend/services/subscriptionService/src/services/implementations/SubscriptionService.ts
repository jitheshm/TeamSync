import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

@injectable()
export class SubscriptionService implements ISubscriptionService {
    private subscriptionRepository: ISubscriptionRepository;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
    }

    async cancelSubscription(subscriptionId: string) {
        const subscription = await stripe.subscriptions.cancel(
            subscriptionId,
        )
        return subscription;
    }
}