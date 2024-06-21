import { Document } from "mongoose";
import IPlan from "../../entities/PlanEntity";

export interface IPlanRepository {
    create(user: Partial<IPlan>): Promise<void>
    
}