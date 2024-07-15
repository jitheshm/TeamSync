import mongoose, { Document } from "mongoose";
import { ITenants } from "../../entities/TenantEntity";
import { IProjects } from "../../entities/ProjectEntity";

export interface IProjectService {
    getTenantById(tenantId: mongoose.Types.ObjectId): Promise<ITenants | null>
    fetchProjectUsers(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & mongoose.Document) | null>
    fetchAllPManagerProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document )[], totalCount: number }>;
    fetchAllDeveloperProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>;
    fetchAllProject(tenantId: string, branchId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>;
    fetchSpecificProjectDetails(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<IProjects | null>;
    fetchSpecificProject(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<IProjects | null>;
    createProject(projectData: Partial<IProjects>, tenantId: string): Promise<IProjects>;
}
