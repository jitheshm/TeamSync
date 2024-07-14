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

    async fetchProjectAllTask( tenantId: string, branchId: mongoose.Types.ObjectId, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{data: (ITasks & mongoose.Document)[],totalCount: number}> {
        return await this.taskRepository.fetchProjectAllTask(tenantId, branchId, projectId, search, page, limit);
    }

}
