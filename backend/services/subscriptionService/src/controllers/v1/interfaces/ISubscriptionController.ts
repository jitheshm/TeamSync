import { NextFunction, Response,Request } from "express";
import { CustomRequest } from "teamsync-common";

export interface ISubscriptionController {
    cancelSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    createSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchSubscriptionDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getAllSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    updateSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getUserSubscription(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchPlanStats(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchProfit(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    paymentRetry(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    webhookHandler(req: Request, res: Response, next: NextFunction): Promise<void>
}