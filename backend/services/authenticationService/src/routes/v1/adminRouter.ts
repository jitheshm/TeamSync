import { Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import adminAuth from "../../middlewares/adminAuth";
import admintokenVerifyController from "../../controllers/v1/admintokenVerifyController";
import adminLoginController from "../../controllers/v1/adminLoginController";


const router = Router()
router.post('/login', checkSchema(adminLoginValidator()), adminLoginController)
router.get('/token/verify', adminAuth, admintokenVerifyController)


export default router