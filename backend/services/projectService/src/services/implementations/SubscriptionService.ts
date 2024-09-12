// src/services/implementations/UserService.ts

import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";

@injectable()
export class SubscriptionService implements ISubscriptionService {
    private subscriptionRepository: ISubscriptionRepository;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
    }



    async handleKafkaEvent(eventType: string, data: any): Promise<void> {
        switch (eventType) {
            case 'create':
                await this.subscriptionRepository.create(data)
                break;
            case 'update':
                await this.subscriptionRepository.update(data)
                break;
        }
    }
}
