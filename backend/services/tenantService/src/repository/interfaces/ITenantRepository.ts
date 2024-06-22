import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantRepository {
    create(data: Partial<ITenants>): Promise<void>
}