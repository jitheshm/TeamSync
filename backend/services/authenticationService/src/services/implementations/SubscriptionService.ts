import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repository/interface/ISubscriptionRepository";
import ISubscriptionService from "../interfaces/ISubscriptionService";

@injectable()
export default class SubscriptionService implements ISubscriptionService {
    private subscriptionRepository: ISubscriptionRepository;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleSubscriptionEvents(dataObj: any) {
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