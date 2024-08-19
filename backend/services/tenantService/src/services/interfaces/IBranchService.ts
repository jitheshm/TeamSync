import mongoose from "mongoose";
import { IBranches } from "../../entities/BranchEntity";

export interface IBranchService {
    createBranch(tenantId: string, body: Partial<IBranches>): Promise<void>
    deleteBranch(tenantId: string, branchId: mongoose.Types.ObjectId): Promise<void>
    getAllBranches(tenantId: string, name: string | null, page: number, limit: number): Promise<{
        data: (IBranches & mongoose.Document<unknown, any, any>)[];
        total: number;
    }>
}