import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IProjects } from "../../entities/ProjectEntity";


export interface IProjectRepository {
    create(data: IProjects, dbId: string): Promise<IProjects & Document>
    fetchSpecificProject(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document) | null>
    update(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId): Promise<IProjects | null>
    delete(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId): Promise<IProjects | null>
    fetchAllProject(dbId: string, branchId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>
    fetchSpecificProjectDetails(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document) | null>
    fetchAllPManagerProjects(dbId: string, branchId: mongoose.Types.ObjectId, pManagerId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>
    fetchAllDeveloperProjects(dbId: string, branchId: mongoose.Types.ObjectId, developerId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>
    fetchProjectUsers(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<(IProjects & Document) | null>
    fetchAllTesterProjects(dbId: string, branchId: mongoose.Types.ObjectId, testerId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IProjects & Document)[], totalCount: number }>
    fetchRecentProjects(dbId: string, branchId?: mongoose.Types.ObjectId, pmId?: mongoose.Types.ObjectId): Promise<(IProjects & Document)[]>
    fetchProjectStats(dbId: string, branchId: mongoose.Types.ObjectId): Promise<any[]>
    fetchBranchProjectsCount(dbId: string, startDate: Date): Promise<any[]>

}