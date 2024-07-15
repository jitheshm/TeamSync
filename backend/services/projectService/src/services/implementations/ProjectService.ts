import mongoose from "mongoose";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { ITenants } from "../../entities/TenantEntity";


export default class ProjectService implements IProjectService {
    private tenantRepository: ITenantRepository;
    private projectRepository: IProjectRepository;

    constructor(tenantRepository: ITenantRepository, projectRepository: IProjectRepository) {
        this.tenantRepository = tenantRepository;
        this.projectRepository = projectRepository;
    }

    async getTenantById(tenantId: mongoose.Types.ObjectId) {
        return await this.tenantRepository.getTenantById(tenantId);
    }

    async fetchProjectUsers(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        return await this.projectRepository.fetchProjectUsers(tenantId, projectId, branchId);
    }
}
