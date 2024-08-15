import { NextFunction, Request, Response } from "express";
import IDecodedUser from "../../../interfaces/IDecodeUser";
import { CustomRequest } from "teamsync-common";

export interface IProjectController {
    fetchBranchProjectCount(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createProject(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}