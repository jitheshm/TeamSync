import { Document } from "mongoose";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";


export default class SubscriptionService implements ISubscriptionService {
    private subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    async handleEvent(eventType: string, data: any): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                    await this.subscriptionRepository.create(data);
                case "update":
                    await this.subscriptionRepository.update(data);
                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle subscription event");
        }
    }

}
