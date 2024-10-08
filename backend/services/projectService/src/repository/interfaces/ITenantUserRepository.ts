import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITenantUsers } from "../../entities/TenantUserEntity";


export interface ITenantUserRepository {
    create(data: ITenantUsers, dbId: string): Promise<ITenantUsers & Document>
    fetchTenantUsers(dbId: string,role:string| null): Promise<(ITenantUsers & Document)[]>
    fetchSpecificUser(dbId: string, email: string): Promise<(ITenantUsers & Document) | null>
    update(data: Partial<ITenantUsers>, dbId: string, userId: mongoose.Types.ObjectId): Promise<ITenantUsers | null>
    delete(data:Partial<ITenantUsers>,dbId: string, userId: mongoose.Types.ObjectId): Promise<ITenantUsers | null>
    fetchTenantSpecificUser(dbId: string, userId: mongoose.Types.ObjectId): Promise<(ITenantUsers & Document) | null>
    fetchAvailableTenantUsers(dbId: string, branchId: mongoose.Types.ObjectId, role: string): Promise<(ITenantUsers&Document)[]>
    fetchTenantUserByEmail(email: string, dbId: string): Promise<ITenantUsers | null>


}