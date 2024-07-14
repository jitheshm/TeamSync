import { Document } from "mongoose";

export interface ISubscriptionService {
    handleEvent(eventType: string, data: any): Promise<void>;
   
}
