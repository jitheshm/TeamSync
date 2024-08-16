import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";

export interface ISubscriptionController {
    cancelSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchSubscriptionDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getAllSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    updateSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}