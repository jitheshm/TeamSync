import mongoose from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantService {
    getTenantById(tenantId: mongoose.Types.ObjectId): Promise<ITenants | null>;
}
