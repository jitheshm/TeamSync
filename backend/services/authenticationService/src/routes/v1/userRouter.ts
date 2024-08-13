import { NextFunction, Request, Response, Router } from "express";
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
import userAuth from "../../middlewares/userAuth";
import tokenVerifyController from "../../controllers/v1/tokenVerifyController";
import tenantLoginValidator from "../../validators/tenantLoginValidator";
import tenantLoginController from "../../controllers/v1/tenantLoginController";
import resendOtpController from "../../controllers/v1/resendOtpController";
import resendValidator from "../../validators/resendValidator";
import newTokenController from "../../controllers/v1/newTokenController";
import { container } from "../../config/inversify/inversify";
import IUserController from "../../controllers/v1/interfaces/IUserController";



const router = Router();

const userController = container.get<IUserController>("IUserController");


router.post('/verify-otp', checkSchema(otpValidator()), otpVerifyController)
router.post('/login', checkSchema(loginValidator()), loginController)
router.post('/token/new', newTokenController);
router.post('/forget-password', checkSchema(forgetValidator()), forgetPasswordController)
router.post('/reset-password', otpAuth, checkSchema(resetPasswordValidator()), resetPasswordController)
router.get('/token/verify', userAuth, tokenVerifyController)
router.post('/login/firebase',
    (req: Request, res: Response, next: NextFunction) => userController.firebaseLogin(req, res, next))
router.post('/tenant/login', checkSchema(tenantLoginValidator()), tenantLoginController)
router.post('/resend-otp', checkSchema(resendValidator()), resendOtpController)

export default router 