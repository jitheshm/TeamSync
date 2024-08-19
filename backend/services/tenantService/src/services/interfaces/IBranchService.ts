import { IBranches } from "../../entities/BranchEntity";

export interface IBranchService {
    createBranch(tenantId: string, body: Partial<IBranches>): Promise<void>
}