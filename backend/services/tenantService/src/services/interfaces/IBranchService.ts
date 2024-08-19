import mongoose from "mongoose";
import { IBranches } from "../../entities/BranchEntity";

export interface IBranchService {
    createBranch(tenantId: string, body: Partial<IBranches>): Promise<void>
    deleteBranch(tenantId: string, branchId: mongoose.Types.ObjectId): Promise<void>
}