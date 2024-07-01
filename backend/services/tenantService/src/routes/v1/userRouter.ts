import { Router } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../validator/tenantValidator";
import createTenantController from "../../controllers/v1/createTenantController";
import userAuth from "../../middlewares/userAuth";
import createBranchController from "../../controllers/v1/createBranchController";
import getAllBranchController from "../../controllers/v1/getAllBranchController";
import updateBranchController from "../../controllers/v1/updateBranchController";



const router = Router();

router.post('/tenants', userAuth, checkSchema(tenantValidator()), createTenantController)
router.post('/tenants/branches', userAuth, createBranchController)
router.get('/tenants/branches', userAuth, getAllBranchController)
router.put('/tenants/branches/:branchId', userAuth, updateBranchController)



export default router