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



const router = Router();

router.post('/tenants', userAuth, checkSchema(tenantValidator()), createTenantController)
router.post('/tenants/branches', userAuth,checkSchema(branchValidator()), createBranchController)
router.get('/tenants/branches', userAuth, getAllBranchController)
router.put('/tenants/branches/:branchId', userAuth,checkSchema(branchValidator()), updateBranchController)
router.delete('/tenants/branches/:branchId', userAuth, deleteBranchController)



export default router