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
import tenantAuth from "../../middlewares/tenantAuth";
import fetchTenantSpecificUserController from "../../controllers/v1/fetchTenantSpecificUserController";
import fetchTenantBranchUsersController from "../../controllers/v1/fetchTenantBranchUsersController";


const router = Router();

router.post('/register', checkSchema(signupValidator()), signupController)
router.post('/tenants/users', userAuth, tenantAuth, checkSchema(tenantUserValidator()), createTenantUserController)
router.put('/tenants/users/:userId', userAuth, tenantAuth, checkSchema(tenantUserValidator()), updateTenantUserController)
router.delete('/tenants/branches/:branchId/users/:userId', userAuth, tenantAuth, deleteTenantUserController)
router.get('/tenants/users', userAuth, fetchTenantUsersController)
router.get('/tenants/branches/users', userAuth, fetchTenantBranchUsersController)
router.get('/tenants/users/:userId', userAuth, fetchTenantSpecificUserController)

export default router