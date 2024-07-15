import mongoose from "mongoose";
import { ITasks } from "../../entities/TaskEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";


export interface ITaskService {
    createTask(user: IDecodedUser, body: Partial<ITasks>, projectId: string): Promise<ITasks>;
    fetchProjectAllTask(tenantId: string, branchId: mongoose.Types.ObjectId, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITasks & mongoose.Document)[], totalCount: number }>
    fetchSpecificTaskDetails(tenantId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<ITasks | null>;
}
