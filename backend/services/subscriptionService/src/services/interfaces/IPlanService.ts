import mongoose, { Document } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanService {
    createPlan(bodyObj: IPlan): Promise<void>
    deletePlan(id: mongoose.Types.ObjectId): Promise<(IPlan & Document) | null>
    fetchAllPlan(page: string | null, limit: string | null, name: string | null): Promise<{
        data: any[];
        total: any;
    }>
    getAvailablePlans(page: string | null, limit: string | null, name: string | null): Promise<{
        data: any[];
        total: any;
    }>
    getSpecificPlan(planId: mongoose.Types.ObjectId): Promise<IPlan | null>
    updatePlan(bodyObj: Partial<IPlan>, planId: string): Promise<void>
}