import { Router } from "express";
import { checkSchema } from "express-validator";
import planValidator from "../../validators/planValidator";
import planController from "../../controllers/v1/planController";
import adminAuth from "../../middlewares/adminAuth";
import updatePlanController from "../../controllers/v1/updatePlanController";
import deletePlanController from "../../controllers/v1/deletePlanController";


const router = Router();

router.post('/subscription-plans', adminAuth, checkSchema(planValidator()), planController)
router.put('/subscription-plans/:planId', adminAuth, checkSchema(planValidator()), updatePlanController)
router.delete('/subscription-plans/:planId', adminAuth, deletePlanController)

export default router