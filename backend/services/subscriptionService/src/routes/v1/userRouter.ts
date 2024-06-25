import { Router } from "express";
import subscriptionController from "../../controllers/v1/subscriptionController";
import userAuth from "../../middlewares/userAuth";

const router = Router();


router.post('/subscriptions',userAuth,subscriptionController)


export default router