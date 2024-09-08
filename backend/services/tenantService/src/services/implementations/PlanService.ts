import { inject, injectable } from "inversify";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import { IPlanService } from "../interfaces/IPlanService";

@injectable()
export class PlanService implements IPlanService {
    private planRepository: IPlanRepository

    constructor(
        @inject("IPlanRepository") planRepository: IPlanRepository
    ) {
        this.planRepository = planRepository
    }

    async handleKafkaEvent(dataObj: any) {
        switch (dataObj.eventType) {
            case 'create':
                await this.planRepository.create(dataObj.data)
                break;
            case 'update':
                await this.planRepository.update(dataObj.data, dataObj.data._id)
                break;
        }
    }
}