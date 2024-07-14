import { Document } from "mongoose";

export interface IProjectService {
    handleEvent(eventType: string, data: any, dbName: string): Promise<void>;
}
