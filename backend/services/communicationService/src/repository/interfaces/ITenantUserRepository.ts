import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITenantUsers } from "../../entities/TenantUserEntity";


export interface ITenantUserRepository {
    create(data: ITenantUsers, dbId: string): Promise<ITenantUsers & Document>
    update(data: Partial<ITenantUsers>, dbId: string, userId: mongoose.Types.ObjectId): Promise<ITenantUsers | null>
    fetchTenantUserByEmail(email: string, dbId: string): Promise<ITenantUsers | null>



}