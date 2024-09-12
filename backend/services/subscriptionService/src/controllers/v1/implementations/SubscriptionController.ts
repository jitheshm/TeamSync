import { inject, injectable } from "inversify";
import { ISubscriptionController } from "../interfaces/ISubscriptionController";
import { ISubscriptionService } from "../../../services/interfaces/ISubscriptionService";
import { CustomError, CustomRequest } from "teamsync-common";
import { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";



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
            res.json({ message: "Subscription created successfully", subscription });


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

    async fetchSubscriptionDetails(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let userId = new mongoose.Types.ObjectId(req.user?.decode?.id);

            let data = await this.subscriptionService.fetchSubscriptionDetails(userId)
            if (data) {
                res.status(200).json({ data: data })
            } else {
                throw new CustomError("No subscription found", 404)
            }

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async getAllSubscription(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const name = req.query.name as string | null
            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 1000)
            const subscriptions = await this.subscriptionService.getAllSubscription(page, limit, name)
            res.status(200).json({ data: subscriptions })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async updateSubscription(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let customerId = req.params.customerId as string
            let subscriptionId = req.params.subscriptionId as string
            let planId = req.body.plan_id as string

            const subscription = await this.subscriptionService.updateSubscription(customerId, subscriptionId, planId)

            res.json(subscription);

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async getUserSubscription(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let userId = new mongoose.Types.ObjectId(req.params.userId);

            let data = await this.subscriptionService.getUserSubscription(userId)
            if (data) {
                res.status(200).json({ data: data })
            } else {
                throw new CustomError("No subscription found", 404)
            }

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async fetchPlanStats(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const result = await this.subscriptionService.fetchPlanStats()
            res.status(200).json({ data: result });

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async fetchProfit(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const result = await this.subscriptionService.fetchProfit()
            res.status(200).json({ data: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async paymentRetry(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const invoiceId = req.body.invoiceId as string;
            const paymentIntent = await this.subscriptionService.paymentRetry(invoiceId)
            res.status(200).json({ paymentIntent });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async webhookHandler(req: Request, res: Response, next: NextFunction) {

        try {
            const sig = req.headers['stripe-signature'] as string | string[] | Buffer;
            await this.subscriptionService.webhookHandler(sig, req.body)
            res.status(200).send("Webhook received");

        } catch (error) {
            console.log(error)
            next(error)
        }
    }


}