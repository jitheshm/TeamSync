import { Router } from "express";
import { checkSchema } from "express-validator";
import otpVerifyController from "../../controllers/v1/otpVerifyController";
import otpValidator from "../../validators/otpValidator";
import loginController from "../../controllers/v1/loginController";
import loginValidator from "../../validators/loginValidator";
import forgetValidator from "../../validators/forgetValidator";
import forgetPasswordController from "../../controllers/v1/forgetPasswordController";
import resetPasswordValidator from "../../validators/resetPasswordValidator";
import resetPasswordController from "../../controllers/v1/resetPasswordController";
import otpAuth from "../../middlewares/otpAuth";



const router = Router();

router.post('/verify-otp', checkSchema(otpValidator()), otpVerifyController)
router.post('/login', checkSchema(loginValidator()), loginController)
router.post('/forget-password', checkSchema(forgetValidator()), forgetPasswordController)
router.post('/reset-password', otpAuth,checkSchema(resetPasswordValidator()), resetPasswordController)

export default router