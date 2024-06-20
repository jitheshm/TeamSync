import { Router } from "express";
import { checkSchema } from "express-validator";
import adminLoginValidator from "../../validators/adminLoginValidator";
import adminLoginController from "../../controllers/v1/adminLoginController";


const router = Router()
router.post('/login', checkSchema(adminLoginValidator()), adminLoginController)

export default router