import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IProjects } from "../../entities/ProjectEntity";


export interface IProjectRepository {
    create(data: IProjects, dbId: string): Promise<IProjects & Document>
    fetchSpecificProject(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document) | null>
    update(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId): Promise<IProjects | null>
    delete(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId): Promise<IProjects | null>
    fetchAllProject(dbId: string, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document)[]>
    fetchSpecificProjectDetails(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document) | null>
    fetchAllPManagerProjects(dbId: string, branchId: mongoose.Types.ObjectId, pManagerId: mongoose.Types.ObjectId):Promise<(IProjects & Document)[]>
    

}