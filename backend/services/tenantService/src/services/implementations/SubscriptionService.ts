import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { ISubscriptionService } from "../interfaces/ISubscriptionService";

@injectable()
export class SubscriptionService implements ISubscriptionService {

    private subscriptionRepository: ISubscriptionRepository

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository
    ) {
        this.subscriptionRepository = subscriptionRepository
    }

    async handleKafkaEvent(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':

                await this.subscriptionRepository.create(dataObj.data)
                break;
            case 'update':
                await this.subscriptionRepository.update(dataObj.data)
                break;
        }
    }
}