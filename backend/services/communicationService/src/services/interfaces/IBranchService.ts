import { Document } from "mongoose";

export interface IBranchService {
    handleEvent(eventType: string, data: any, dbName: string): Promise<void>;
}
