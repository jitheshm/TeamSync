import { NextFunction,Request,Response } from "express";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { CustomRequest } from "teamsync-common";

export interface ITaskController {
    createTask(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchProjectTasks(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchProjectTaskDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchTaskStats(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}