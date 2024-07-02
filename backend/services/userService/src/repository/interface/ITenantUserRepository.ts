import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITenantUsers } from "../../entities/TenantUserEntity";


export interface ITenantUserRepository {
    create(data: ITenantUsers, dbId: string): Promise<ITenantUsers & Document>
    fetchTenantUsers(dbId: string): Promise<(ITenantUsers & Document)[]>
    fetchSpecificUser(dbId: string, email: string): Promise<(ITenantUsers & Document) | null>
    update(data: ITenantUsers, dbId: string, managerId: mongoose.Types.ObjectId): Promise<ITenantUsers | null>
    delete(dbId: string, managerId: mongoose.Types.ObjectId): Promise<ITenantUsers | null>

}