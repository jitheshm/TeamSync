import mongoose, { Document } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanService {
    deletePlan(id: mongoose.Types.ObjectId): Promise<(IPlan & Document) | null>
}