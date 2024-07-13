import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanRepository {
    create(user: Partial<IPlan>): Promise<void>
    update(data: Partial<IPlan>, id: mongoose.Types.ObjectId): Promise<IPlan & Document | null>
    fetchAll(): Promise<IPlan[]>
    fetchById(id: mongoose.Types.ObjectId): Promise<IPlan | null>
}