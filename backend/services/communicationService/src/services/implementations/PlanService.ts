import { Document } from "mongoose";
import { IPlanService } from "../interfaces/IPlanService";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import { inject, injectable } from "inversify";

@injectable()

export default class PlanService implements IPlanService {
    private planRepository: IPlanRepository;

    constructor(
        @inject("IPlanRepository") planRepository: IPlanRepository
    ) {
        this.planRepository = planRepository;
    }

    async handleEvent(eventType: string, data: any): Promise<void> {
        try {
            switch (eventType) {
                case "create":
                    await this.planRepository.create(data);
                    break;
                case "update":
                    await this.planRepository.update(data, data._id);
                    break;

                default:
                    throw new Error(`Unsupported event type: ${eventType}`);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to handle plan event");
        }
    }

}
