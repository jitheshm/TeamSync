import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanRepository {
    create(user: Partial<IPlan>): Promise<IPlan & Document>
    update(data: Partial<IPlan>, id: mongoose.Types.ObjectId): Promise<IPlan & Document | null>
    fetchAll(page: number, limit: number, name: string | null): Promise<{
        data: any[];
        total: any;
    }>
    fetchAvailablePlans(page: number, limit: number, name: string | null): Promise<{
        data: any[];
        total: any;
    }>
    fetchById(id: mongoose.Types.ObjectId): Promise<IPlan | null>
}