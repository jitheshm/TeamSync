import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IBranches } from "../../entities/BranchEntity";


export interface IBranchRepository {
    create(data: IBranches, dbId: string): Promise<IBranches & Document>
    fetchBranches(dbId: string,name: string | null, page: number, limit: number): Promise<{
        data: (IBranches&Document)[];
        total: number;
    }>
    update(data: IBranches, dbId: string, branchId: mongoose.Types.ObjectId): Promise<IBranches | null>
    delete(dbId: string, branchId: mongoose.Types.ObjectId): Promise<IBranches | null>
    fetchBranchByLocation(dbId: string, branchLocation: string): Promise<IBranches | null>
    fetchSpecificBranches(dbId: string,branchId:mongoose.Types.ObjectId): Promise<((IBranches & Document)|null)>
    fetchBranchCount(dbId: string): Promise<number>

}