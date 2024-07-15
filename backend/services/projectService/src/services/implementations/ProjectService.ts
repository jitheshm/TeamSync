import mongoose, { Document } from "mongoose";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { ITenants } from "../../entities/TenantEntity";
import { IProjects } from "../../entities/ProjectEntity";


interface ProjectServiceProps {
    tenantRepository?: ITenantRepository;
    projectRepository: IProjectRepository;

}

export default class ProjectService implements IProjectService {
    private tenantRepository?: ITenantRepository;
    private projectRepository: IProjectRepository;

    constructor({ tenantRepository, projectRepository }: ProjectServiceProps) {
        this.tenantRepository = tenantRepository;
        this.projectRepository = projectRepository;
    }

    async getTenantById(tenantId: mongoose.Types.ObjectId) {
        return await this.tenantRepository?.getTenantById(tenantId)!;
    }

    async fetchProjectUsers(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        return await this.projectRepository.fetchProjectUsers(tenantId, projectId, branchId);
    }

    async fetchAllPManagerProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllPManagerProjects(tenantId, branchId, userId, search, page, limit);
    }

    async fetchAllDeveloperProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllDeveloperProjects(tenantId, branchId, userId, search, page, limit);
    }

    async fetchAllProject(tenantId: string, branchId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllProject(tenantId, branchId, search, page, limit);
    }

    async fetchSpecificProjectDetails(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<IProjects | null> {

        const resultObj = await this.projectRepository.fetchSpecificProjectDetails(tenantId, projectId, branchId);
        return resultObj;

    }
    async fetchSpecificProject(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<IProjects | null> {

        const resultObj = await this.projectRepository.fetchSpecificProject(tenantId, projectId, branchId);
        return resultObj;
    }


}
