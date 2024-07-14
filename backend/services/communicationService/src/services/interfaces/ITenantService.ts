import { Document } from "mongoose";

export interface ITenantService {
    handleEvent(eventType: string, data: any): Promise<void>;
}
