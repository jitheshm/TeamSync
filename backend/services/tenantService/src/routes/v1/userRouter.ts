import { NextFunction, Router, Response } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../validator/tenantValidator";
import createTenantController from "../../controllers/v1/createTenantController";
import userAuth from "../../middlewares/userAuth";
import updateBranchController from "../../controllers/v1/updateBranchController";
import branchValidator from "../../validator/branchValidator";
import tenantAuth from "../../middlewares/tenantAuth";
import getSpecificBranchController from "../../controllers/v1/getSpecificBranchController";
import getSpecificTenantController from "../../controllers/v1/getSpecificTenantController";
import { CustomRequest, formValidation } from "teamsync-common";
import { container } from "../../config/inversify/inversify";
import { IBranchController } from "../../controllers/v1/interfaces/IBranchController";



const router = Router();

const branchController = container.get<IBranchController>("IBranchController")

router.post('/tenants', userAuth, checkSchema(tenantValidator()), createTenantController)
router.post('/tenants/branches', userAuth, tenantAuth, checkSchema(branchValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.createBranch(req, res, next))
router.get('/tenants/branches', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.getAllBranches(req, res, next)
)
router.get('/tenants/:name', getSpecificTenantController)
router.get('/tenants/branches/:branchId', userAuth, tenantAuth, getSpecificBranchController)
router.put('/tenants/branches/:branchId', userAuth, tenantAuth, checkSchema(branchValidator()), updateBranchController)
router.delete('/tenants/branches/:branchId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.deleteBranch(req, res, next)
)



export default router