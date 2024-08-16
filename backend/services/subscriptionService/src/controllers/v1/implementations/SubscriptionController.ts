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