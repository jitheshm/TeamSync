import { Router } from "express";
import { checkSchema } from "express-validator";
import otpVerifyController from "../../controllers/v1/otpVerifyController";
import otpValidator from "../../validators/otpValidator";



const router = Router();

router.post('/verify-otp', checkSchema(otpValidator()), otpVerifyController)

export default router