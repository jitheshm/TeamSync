import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITasks } from "../../entities/TaskEntity";


export interface ITaskRepository {
    create(data: ITasks, dbId: string): Promise<ITasks & Document>
    fetchSpecificTask(dbId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(ITasks & Document) | null>
    update(data: Partial<ITasks>, dbId: string, taskId: mongoose.Types.ObjectId): Promise<ITasks | null>
    delete(data: Partial<ITasks>, dbId: string, taskId: mongoose.Types.ObjectId): Promise<ITasks | null>
    fetchAllTask(dbId: string, branchId: mongoose.Types.ObjectId): Promise<(ITasks & Document)[]>
    
    

}