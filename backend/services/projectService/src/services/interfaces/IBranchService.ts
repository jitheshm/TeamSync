import mongoose from "mongoose";
import { IBranches } from "../../entities/BranchEntity";


export interface IBranchService {
    createBranch(data: IBranches, dbName: string): Promise<void>;
    updateBranch(data: IBranches, dbName: string, brachId: mongoose.Types.ObjectId): Promise<void>;
    handleKafkaEvent(eventType: string, data: any, dbName: string): Promise<void>;
}
