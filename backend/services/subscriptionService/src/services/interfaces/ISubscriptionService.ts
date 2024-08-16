export interface ISubscriptionService {
    cancelSubscription(subscriptionId: string): Promise<any>
}