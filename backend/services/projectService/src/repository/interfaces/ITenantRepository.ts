import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantRepository {
    create(data: Partial<ITenants>): Promise<mongoose.Schema.Types.ObjectId>
    getTenantById(tenantId: mongoose.Types.ObjectId): Promise<ITenants | null>
}