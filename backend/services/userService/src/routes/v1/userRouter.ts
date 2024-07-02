import { Router } from "express";
import signupController from "../../controllers/v1/signupController";
import { checkSchema } from "express-validator";
import signupValidator from "../../validators/signupValidator";
import userAuth from "../../middlewares/userAuth";
import createTenantUserController from "../../controllers/v1/createTenantUserController";
import tenantUserValidator from "../../validators/tenantUserValidator";
import updateTenantUserController from "../../controllers/v1/updateTenantUserController";
import deleteTenantUserController from "../../controllers/v1/deleteTenantUserController";
import fetchTenantUsersController from "../../controllers/v1/fetchTenantUsersController";


const router = Router();

router.post('/register', checkSchema(signupValidator()), signupController)
router.post('/tenants/users', userAuth, checkSchema(tenantUserValidator()), createTenantUserController)
router.put('/tenants/users/:userId', userAuth, checkSchema(tenantUserValidator()), updateTenantUserController)
router.delete('/tenants/users/:userId', userAuth, deleteTenantUserController)
router.get('/tenants/users', userAuth, fetchTenantUsersController)

export default router