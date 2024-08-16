import { inject, injectable } from "inversify";
import { ISubscriptionController } from "../interfaces/ISubscriptionController";
import { ISubscriptionService } from "../../../services/interfaces/ISubscriptionService";
import { CustomRequest } from "teamsync-common";
import { NextFunction, Response } from "express";

@injectable()
export class SubscriptionController implements ISubscriptionController {
    private subscriptionService: ISubscriptionService;

    constructor(
        @inject("ISubscriptionService") subscriptionService: ISubscriptionService
    ) {
        this.subscriptionService = subscriptionService
    }

    async createSubscription(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let customerId = req.user?.stripe_customer_id
            let planId = req.body.plan_id
            let tenantId = req.body.tenantId
            let userId = req.user?._id
            console.log(customerId, planId, tenantId, userId);

            const subscription = await this.subscriptionService.createSubscription(customerId, planId, tenantId, userId)
            res.json(subscription);


        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async cancelSubscription(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let subscriptionId = req.params.subscriptionId as string
            const subscription = await this.subscriptionService.cancelSubscription(subscriptionId)
            res.status(200).json({ message: "Subscription cancelled successfully", subscription });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

}