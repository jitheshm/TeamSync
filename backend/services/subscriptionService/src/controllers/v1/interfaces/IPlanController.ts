import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface IPlanController {
    createPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    deletePlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchAllPlans(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getAvailablePlans(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getSpecificPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    updatePlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}