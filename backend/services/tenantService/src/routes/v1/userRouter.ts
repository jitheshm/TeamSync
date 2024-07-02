import { Router } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../validator/tenantValidator";
import createTenantController from "../../controllers/v1/createTenantController";
import userAuth from "../../middlewares/userAuth";
import createBranchController from "../../controllers/v1/createBranchController";
import getAllBranchController from "../../controllers/v1/getAllBranchController";
import updateBranchController from "../../controllers/v1/updateBranchController";
import deleteBranchController from "../../controllers/v1/deleteBranchController";
import branchValidator from "../../validator/branchValidator";
import tenantAuth from "../../middlewares/tenantAuth";



const router = Router();

router.post('/tenants', userAuth, checkSchema(tenantValidator()), createTenantController)
router.post('/tenants/branches', userAuth, tenantAuth, checkSchema(branchValidator()), createBranchController)
router.get('/tenants/branches', userAuth, tenantAuth, getAllBranchController)
router.put('/tenants/branches/:branchId', userAuth, tenantAuth, checkSchema(branchValidator()), updateBranchController)
router.delete('/tenants/branches/:branchId', userAuth, tenantAuth, deleteBranchController)



export default router