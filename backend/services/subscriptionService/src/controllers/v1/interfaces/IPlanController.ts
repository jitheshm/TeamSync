import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface IPlanController {
    createPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    deletePlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}