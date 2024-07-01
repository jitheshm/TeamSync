import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IBranches } from "../../entities/BranchEntity";


export interface IBranchRepository {
    create(data: IBranches, dbId: string): Promise<IBranches & Document>
    fetchBranches(dbId: string): Promise<(IBranches & Document)[]>
    update(data: IBranches, dbId: string,branchId:mongoose.Types.ObjectId): Promise<IBranches|null>
    delete(dbId: string,branchId:mongoose.Types.ObjectId): Promise<IBranches|null>

}