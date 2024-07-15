import { Document } from "mongoose";
import { ITenantUsers } from "../../entities/TenantUserEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";
import mongoose from "mongoose";


export interface ITenantUserService {
    getAvailableTenantUsers(user: IDecodedUser, role: string | undefined): Promise<(ITenantUsers & Document)[]>;
    createTenantUser(data: ITenantUsers, dbName: string): Promise<void>;
    updateTenantUser(data: ITenantUsers, dbName: string, id: mongoose.Types.ObjectId): Promise<void>;
    handleKafkaEvent(eventType: string, data: any, dbName: string): Promise<void>;
}
