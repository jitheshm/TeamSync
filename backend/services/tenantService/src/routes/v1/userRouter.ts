import { Router } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../validator/tenantValidator";
import createTenantController from "../../controllers/v1/createTenantController";
import userAuth from "../../middlewares/userAuth";
import createBranchController from "../../controllers/v1/createBranchController";



const router = Router();

router.post('/tenants', userAuth, checkSchema(tenantValidator()), createTenantController)
router.post('/tenants/branch', userAuth, createBranchController)



export default router