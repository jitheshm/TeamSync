import { Document } from "mongoose";
import { ITenants } from "../../entities/TenantEntity";

export interface ITenantService {
    createTenant(bodyObj: Partial<ITenants>): Promise<ITenants & Document>
}