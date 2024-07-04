import mongoose, { Document, ObjectId, Types, UpdateWriteOpResult } from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantRepository {
    create(data: Partial<ITenants>): Promise<ITenants & Document>
    getTenantById(tenantId: Types.ObjectId): Promise<ITenants | null>
    getTenantByName(tenantName: string): Promise<ITenants | null>
}