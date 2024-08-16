import { NextFunction, Router, Response } from "express";
import userAuth from "../../middlewares/userAuth";
import webhookController from "../../controllers/v1/webhookController";
import express from "express";
import { container } from "../../config/inversify/inversify";
import { ISubscriptionController } from "../../controllers/v1/interfaces/ISubscriptionController";
import { CustomRequest } from "teamsync-common";
import { IPlanController } from "../../controllers/v1/interfaces/IPlanController";

const router = Router();

const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController")
const planController = container.get<IPlanController>("IPlanController")


router.post('/subscriptions', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.createSubscription(req, res, next)
)
router.post('/subscriptions/retry', userAuth, 
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.paymentRetry(req, res, next)
)
router.get('/subscription-plans', 
    (req: CustomRequest, res: Response, next: NextFunction) => planController.getAvailablePlans(req, res, next)
)
router.get('/subscription', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.fetchSubscriptionDetails(req, res, next)
)
router.patch('/subscriptions/:subscriptionId/customers/:customerId', userAuth, 
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.updateSubscription(req, res, next)
)
router.patch('/subscriptions/:subscriptionId/cancel', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.cancelSubscription(req, res, next)
)



// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys


router.post('/webhook', webhookController);


export default router