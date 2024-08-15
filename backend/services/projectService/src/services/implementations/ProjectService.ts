import mongoose, { Document } from "mongoose";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { IProjects } from "../../entities/ProjectEntity";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import ProjectProducer from "../../events/kafka/producers/ProjectProducer";
import { inject, injectable } from "inversify";
import { CustomError } from "teamsync-common";




@injectable()
export default class ProjectService implements IProjectService {
    private tenantRepository: ITenantRepository;
    private projectRepository: IProjectRepository;
    private kafkaConnection: IKafkaConnection;

    constructor(
        @inject("IProjectRepository") projectRepository: IProjectRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITenantRepository") tenantRepository: ITenantRepository
    ) {
        this.tenantRepository = tenantRepository;
        this.projectRepository = projectRepository;
        this.kafkaConnection = kafkaConnection;
    }

    async getTenantById(tenantId: mongoose.Types.ObjectId) {
        return await this.tenantRepository?.getTenantById(tenantId)!;
    }

    async fetchProjectUsers(tenantId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        const tenant = await this.tenantRepository.getTenantById(new mongoose.Types.ObjectId(tenantId));
        if (!tenant) {
            throw new CustomError("Tenant not found", 404);
        }
        const availableUsers = await this.projectRepository.fetchProjectUsers(tenantId, projectId, branchId);
        if (!availableUsers) {
            throw new CustomError("Users not found", 404);
        }
        return availableUsers;
    }

    async fetchAllPManagerProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllPManagerProjects(tenantId, branchId, userId, search, page, limit);
    }

    async fetchAllDeveloperProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllDeveloperProjects(tenantId, branchId, userId, search, page, limit);
    }
    async fetchAllTesterProjects(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }> {
        return await this.projectRepository.fetchAllTesterProjects(tenantId, branchId, userId, search, page, limit);
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

    async createProject(projectData: Partial<IProjects>, tenantId: string): Promise<IProjects> {
        try {
            const bodyObj: Partial<IProjects> = projectData;
            bodyObj.project_id = '#project' + new Date().getTime() + Math.floor(Math.random() * 1000);

            const newProject = await this.projectRepository.create(bodyObj as IProjects, tenantId);

            const producer = await this.kafkaConnection?.getProducerInstance();
            const tenantProjectProducer = new ProjectProducer(producer!, tenantId, 'projects');
            tenantProjectProducer.sendMessage('create', newProject);

            return newProject;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async deleteProject(projectData: Partial<IProjects>, tenantId: string, projectId: string): Promise<Partial<IProjects> | null> {
        try {
            const deletedProject = await this.projectRepository.delete(projectData as IProjects, tenantId, new mongoose.Types.ObjectId(projectId));

            if (!deletedProject) {
                return null;
            }

            const producer = await this.kafkaConnection?.getProducerInstance();
            const tenantProjectProducer = new ProjectProducer(producer!, tenantId, 'projects');
            tenantProjectProducer.sendMessage('update', deletedProject);

            return deletedProject;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async updateProjectStatus(statusData: Partial<IProjects>, tenantId: string, projectId: string): Promise<Partial<IProjects> | null> {
        try {
            const updatedProject = await this.projectRepository.update(statusData as IProjects, tenantId, new mongoose.Types.ObjectId(projectId));

            if (!updatedProject) {
                return null;
            }

            const producer = await this.kafkaConnection?.getProducerInstance();
            const tenantProjectProducer = new ProjectProducer(producer!, tenantId, 'projects');
            tenantProjectProducer.sendMessage('update', updatedProject);

            return updatedProject;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async updateProject(projectId: string, projectData: Partial<IProjects>, tenantId: string): Promise<Partial<IProjects> | null> {
        try {
            const updatedProject = await this.projectRepository.update(projectData as IProjects, tenantId, new mongoose.Types.ObjectId(projectId));

            if (!updatedProject) {
                return null;
            }

            const producer = await this.kafkaConnection?.getProducerInstance();
            const tenantProjectProducer = new ProjectProducer(producer!, tenantId, 'projects');
            tenantProjectProducer.sendMessage('update', updatedProject);

            return updatedProject;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async fetchRecentProjects(tenantId: string, branchId?: mongoose.Types.ObjectId, pmId?: mongoose.Types.ObjectId): Promise<(IProjects & Document)[]> {
        return await this.projectRepository.fetchRecentProjects(tenantId, branchId, pmId);
    }

    async fetchProjectStats(tenantId: string, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document)[]> {
        return await this.projectRepository.fetchProjectStats(tenantId, branchId);
    }

    async fetchBranchProjectsCount(tenantId: string, period: 'week' | 'month' | '6month' | 'year'): Promise<(any)[]> {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            case '6month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                break;
            default:
                throw new Error('Invalid period');
        }

        return await this.projectRepository.fetchBranchProjectsCount(tenantId, startDate);

    }




}
