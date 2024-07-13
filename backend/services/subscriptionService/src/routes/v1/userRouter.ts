import { Router } from "express";
import subscriptionController from "../../controllers/v1/stripeSubscriptionController";
import userAuth from "../../middlewares/userAuth";
import webhookController from "../../controllers/v1/webhookController";
import express from "express";
import getAllPlansController from "../../controllers/v1/getAllPlansController";
import getUserSubscriptionController from "../../controllers/v1/getUserSubscriptionController";
import getSubscriptionDetailsController from "../../controllers/v1/getSubscriptionDetailsController";
import cancelSubscriptionController from "../../controllers/v1/cancelSubscriptionController";

const router = Router();


router.post('/subscriptions', userAuth, subscriptionController)
router.get('/subscription-plans', getAllPlansController)
router.get('/subscription', userAuth, getSubscriptionDetailsController)
router.patch('/subscriptions/:subscriptionId/cancel', userAuth, cancelSubscriptionController)



// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys


router.post('/webhook', webhookController);


export default router