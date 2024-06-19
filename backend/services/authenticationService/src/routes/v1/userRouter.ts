import { Router } from "express";
import signupController from "../../controllers/v1/signupController";
import { checkSchema } from "express-validator";
import signupValidator from "../../validators/signupValidator";


const router = Router();

router.post('/verify-otp', checkSchema(otpValidator()), otpVerifyController)

export default router