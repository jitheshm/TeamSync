import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface IBranchController {
    createBranch(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    deleteBranch(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getAllBranches(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getSpecificBranch(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}