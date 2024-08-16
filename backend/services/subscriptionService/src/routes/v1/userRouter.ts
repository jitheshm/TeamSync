import { NextFunction, Router, Response } from "express";
import userAuth from "../../middlewares/userAuth";
import webhookController from "../../controllers/v1/webhookController";
import express from "express";
import getAvailablePlans from "../../controllers/v1/getAvailablePlans";
import paymentRetryController from "../../controllers/v1/paymentRetryController";
import { container } from "../../config/inversify/inversify";
import { ISubscriptionController } from "../../controllers/v1/interfaces/ISubscriptionController";
import { CustomRequest } from "teamsync-common";

const router = Router();

const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController")


router.post('/subscriptions', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.createSubscription(req, res, next)
)
router.post('/subscriptions/retry', userAuth, paymentRetryController)
router.get('/subscription-plans', getAvailablePlans)
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