import mongoose from "mongoose";
import { ITaskService } from "../interfaces/ITaskService";
import { ITaskRepository } from "../../repository/interfaces/ITaskRepository";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITasks } from "../../entities/TaskEntity";

export default class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(user: IDecodedUser, body: Partial<ITasks>, projectId: string): Promise<ITasks> {
        if (user.decode?.role !== 'Tenant_Admin') {
            if (user.decode?.role !== 'Project_Manager') {
                throw new Error("Unauthorized");
            }
            body.branch_id = new mongoose.Types.ObjectId(user.decode?.branchId as string);
        } else {
            if (!body.branch_id) {
                throw new Error("Branch id must needed");
            }
        }

        body.task_id = '#task' + new Date().getTime() + Math.floor(Math.random() * 1000);
        body.project_id = new mongoose.Types.ObjectId(projectId);

        return await this.taskRepository.create(body as ITasks, user.decode?.tenantId);
    }

    async fetchProjectAllTask(tenantId: string, branchId: mongoose.Types.ObjectId, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITasks & mongoose.Document)[], totalCount: number }> {
        return await this.taskRepository.fetchProjectAllTask(tenantId, branchId, projectId, search, page, limit);
    }

    async fetchSpecificTaskDetails(tenantId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<ITasks | null> {
        return await this.taskRepository.fetchSpecificTaskDetails(tenantId, taskId, branchId);
    }

    async deleteTask(data: Partial<ITasks>, taskId: mongoose.Types.ObjectId, tenantId: string): Promise<boolean> {
        try {
            const result = await this.taskRepository.delete(data, tenantId, taskId);
            return !!result;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async updateTask(taskId: string, bodyObj: Partial<ITasks>, tenantId: string): Promise<ITasks | null> {
        try {
            const resultObj = await this.taskRepository.update(bodyObj, tenantId, new mongoose.Types.ObjectId(taskId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async fetchTaskStats(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<{
        status: string;
        count: number;
    }[]> {
        return await this.taskRepository.fetchTaskStats(tenantId, branchId, userId);
    }

}
