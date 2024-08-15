import { NextFunction, Request, Response } from "express";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { CustomRequest } from "teamsync-common";

export interface IProjectController {
    fetchBranchProjectCount(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createProject(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchBranchRecentProjects(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchProjectStats(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchProjectUsers(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchRecentProjects(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getProjectDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getSpecificProject(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    projectDelete(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    projectStatusUpdate(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    projectUpdate(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}