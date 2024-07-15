import mongoose from "mongoose";
import { ITenants } from "../../entities/TenantEntity";
import { IProjects } from "../../entities/ProjectEntity";

export interface IProjectService {
    getTenantById(tenantId: mongoose.Types.ObjectId): Promise<ITenants | null>
    fetchProjectUsers(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & mongoose.Document) | null>
}
