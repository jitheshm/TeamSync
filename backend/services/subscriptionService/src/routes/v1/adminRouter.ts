import { Router } from "express";
import { check, checkSchema } from "express-validator";
import planValidator from "../../validators/planValidator";
import planController from "../../controllers/v1/planController";
import adminAuth from "../../middlewares/adminAuth";
import updatePlanController from "../../controllers/v1/updatePlanController";
import deletePlanController from "../../controllers/v1/deletePlanController";
import getAllPlansController from "../../controllers/v1/getAllPlansController";
import getUserSubscriptionController from "../../controllers/v1/getUserSubscriptionController";
import getSpecificPlanController from "../../controllers/v1/getSpecificPlanController";
import getAllSubscriptionController from "../../controllers/v1/getAllSubscriptionController";
import fetchProfit from "../../controllers/v1/fetchProfit";
import fetchPlanStats from "../../controllers/v1/fetchPlanStats";


const router = Router();

router.post('/subscription-plans', adminAuth, checkSchema(planValidator()), planController)
router.get('/subscription-plans', adminAuth, getAllPlansController)
router.get('/subscription-plans/stats', adminAuth, fetchPlanStats)
router.get('/subscription-plans/:planId', adminAuth, getSpecificPlanController)
router.put('/subscription-plans/:planId', adminAuth, checkSchema(planValidator()), updatePlanController)
router.patch('/subscription-plans/:planId', adminAuth, check('active').isBoolean().withMessage('active must be a boolean value (true or false)'), updatePlanController)
router.delete('/subscription-plans/:planId', adminAuth, deletePlanController)


router.get('/subscriptions/users/:userId', adminAuth, getUserSubscriptionController)
router.get('/subscriptions', adminAuth, getAllSubscriptionController)
router.get('/subscriptions/profit', adminAuth, fetchProfit)

export default router