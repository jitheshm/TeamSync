import { Document } from "mongoose";

export interface ITenantService {
    handleEvent(eventType: string, data: any): Promise<void>;
    tenantAuth(decode: any, body: any, params: any): Promise<void>
}
