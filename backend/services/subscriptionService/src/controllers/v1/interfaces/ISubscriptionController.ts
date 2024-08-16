import { NextFunction,Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ISubscriptionController {
    cancelSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}