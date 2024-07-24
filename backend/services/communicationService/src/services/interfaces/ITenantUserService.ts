import { ITenantUsers } from "../../entities/TenantUserEntity";

export interface ITenantUserService {
    handleEvent(eventType: string, data: any, dbName: string): Promise<void>;
    fetchTenantUserByEmail(email: string, dbName: string): Promise<ITenantUsers | null>
    
}
