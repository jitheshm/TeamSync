import mongoose, { Document } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanService {
    createPlan(bodyObj: IPlan): Promise<void>
    deletePlan(id: mongoose.Types.ObjectId): Promise<(IPlan & Document) | null>
}