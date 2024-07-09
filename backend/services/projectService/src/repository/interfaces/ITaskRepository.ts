import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITasks } from "../../entities/TaskEntity";


export interface ITaskRepository {
    create(data: ITasks, dbId: string): Promise<ITasks & Document>
    fetchSpecificTask(dbId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(ITasks & Document) | null>
    update(data: Partial<ITasks>, dbId: string, taskId: mongoose.Types.ObjectId): Promise<ITasks | null>
    delete(data: Partial<ITasks>, dbId: string, taskId: mongoose.Types.ObjectId): Promise<ITasks | null>
    fetchProjectAllTask(dbId: string, branchId: mongoose.Types.ObjectId, projectId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{
        data: (ITasks & Document)[], totalCount: number
    }>
    fetchSpecificTaskDetails(dbId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<ITasks & Document>
    
    

}