import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface IBranchController {
    createBranch(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}