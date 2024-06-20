import { Router } from "express";
import { checkSchema } from "express-validator";
import otpVerifyController from "../../controllers/v1/otpVerifyController";
import otpValidator from "../../validators/otpValidator";
import loginController from "../../controllers/v1/loginController";
import loginValidator from "../../validators/loginValidator";



const router = Router();

router.post('/verify-otp', checkSchema(otpValidator()), otpVerifyController)
router.post('/login', checkSchema(loginValidator()), loginController)

export default router