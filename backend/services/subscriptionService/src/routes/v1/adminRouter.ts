import { NextFunction, Response, Router } from "express";
import { check, checkSchema } from "express-validator";
import planValidator from "../../validators/planValidator";
import adminAuth from "../../middlewares/adminAuth";
import updatePlanController from "../../controllers/v1/updatePlanController";
import { container } from "../../config/inversify/inversify";
import { ISubscriptionController } from "../../controllers/v1/interfaces/ISubscriptionController";
import { CustomRequest, formValidation } from "teamsync-common";
import { IPlanController } from "../../controllers/v1/interfaces/IPlanController";


const router = Router();
const subscriptionController = container.get<ISubscriptionController>("ISubscriptionController")
const planController = container.get<IPlanController>("IPlanController")


router.post('/subscription-plans', adminAuth, checkSchema(planValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => planController.createPlan(req, res, next))
router.get('/subscription-plans', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => planController.fetchAllPlans(req, res, next)
)
router.get('/subscription-plans/stats', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.fetchPlanStats(req, res, next)
)
router.get('/subscription-plans/:planId', adminAuth, 
    (req: CustomRequest, res: Response, next: NextFunction) => planController.getSpecificPlan(req, res, next)
)
router.put('/subscription-plans/:planId', adminAuth, checkSchema(planValidator()), updatePlanController)
router.patch('/subscription-plans/:planId', adminAuth, check('active').isBoolean().withMessage('active must be a boolean value (true or false)'), updatePlanController)
router.delete('/subscription-plans/:planId', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => planController.deletePlan(req, res, next)
)


router.get('/subscriptions/users/:userId', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.getUserSubscription(req, res, next)
)
router.get('/subscriptions', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.getAllSubscription(req, res, next)
)
router.get('/subscriptions/profit', adminAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => subscriptionController.fetchProfit(req, res, next)
)

export default router