import { inject, injectable } from "inversify";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import { IPlanService } from "../interfaces/IPlanService";
import mongoose from "mongoose";

@injectable()
export class PlanService implements IPlanService {
    private planRepository: IPlanRepository

    constructor(
        @inject("IPlanRepository") planRepository: IPlanRepository
    ) {
        this.planRepository = planRepository
    }

    async deletePlan(id: mongoose.Types.ObjectId) {
        let resObj = await this.planRepository.update({ is_deleted: true }, id);
        return resObj;
    }
}