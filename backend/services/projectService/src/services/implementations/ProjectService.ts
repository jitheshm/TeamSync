import mongoose, { Document } from "mongoose";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import { IProjectService } from "../interfaces/IProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { ITenants } from "../../entities/TenantEntity";
import { IProjects } from "../../entities/ProjectEntity";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import ProjectProducer from "../../events/kafka/producers/ProjectProducer";


interface ProjectServiceProps {
    tenantRepository?: ITenantRepository;
    projectRepository: IProjectRepository;
    kafkaConnection?: IKafkaConnection;

}

export default class ProjectService implements IProjectService {
    private tenantRepository?: ITenantRepository;
    private projectRepository: IProjectRepository;
    private kafkaConnection?: IKafkaConnection;

    constructor({ tenantRepository, projectRepository, kafkaConnection }: ProjectServiceProps) {
        this.tenantRepository = tenantRepository;
        this.projectRepository = projectRepository;
        this.kafkaConnection = kafkaConnection;
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






}
