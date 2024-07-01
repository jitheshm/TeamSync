import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IBranches } from "../../entities/BranchEntity";


export interface IBranchRepository {
    create(data: IBranches, dbId: string): Promise<IBranches & Document>
}