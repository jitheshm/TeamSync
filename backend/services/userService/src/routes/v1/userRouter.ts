import { Router } from "express";
import signupController from "../../controllers/v1/signupController";
import { checkSchema } from "express-validator";
import signupValidator from "../../validators/signupValidator";
import userAuth from "../../middlewares/userAuth";
import createTenantUserController from "../../controllers/v1/createTenantUserController";
import tenantUserValidator from "../../validators/tenantUserValidator";


const router = Router();

router.post('/register', checkSchema(signupValidator()), signupController)
router.post('/tenants/users', userAuth, checkSchema(tenantUserValidator()), createTenantUserController)

export default router