import { Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import adminLoginController from "../../controllers/v1/adminLoginController";
import adminAuth from "../../middlewares/adminAuth";
import admintokenVerifyController from "../../controllers/v1/admintokenVerifyController";
import adminNewTokenController from "../../controllers/v1/adminNewTokenController";


const router = Router()
router.post('/login', checkSchema(adminLoginValidator()), adminLoginController)
router.get('/token/verify', adminAuth, admintokenVerifyController)
router.post('/token/new', adminNewTokenController);



export default router