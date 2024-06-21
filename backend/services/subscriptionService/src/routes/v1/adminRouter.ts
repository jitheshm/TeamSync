import { Router } from "express";
import { checkSchema } from "express-validator";
import planValidator from "../../validators/planValidator";
import planController from "../../controllers/v1/planController";
import adminAuth from "../../middlewares/adminAuth";


const router = Router();

router.post('/subscription-plans', adminAuth, checkSchema(planValidator()), planController)

export default router