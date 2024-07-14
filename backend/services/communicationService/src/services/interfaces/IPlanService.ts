import { Document } from "mongoose";

export interface IPlanService {
    handleEvent(eventType: string, data: any): Promise<void>;
}
