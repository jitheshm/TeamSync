import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IProjects } from "../../entities/ProjectEntity";


export interface IProjectRepository {
    create(data: IProjects, dbId: string): Promise<IProjects & Document>
    update(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId): Promise<IProjects | null>
    
}