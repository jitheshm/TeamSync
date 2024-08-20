import { NextFunction, Router, Response } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../validator/tenantValidator";
import userAuth from "../../middlewares/userAuth";
import branchValidator from "../../validator/branchValidator";
import tenantAuth from "../../middlewares/tenantAuth";
import getSpecificTenantController from "../../controllers/v1/getSpecificTenantController";
import { CustomRequest, formValidation } from "teamsync-common";
import { container } from "../../config/inversify/inversify";
import { IBranchController } from "../../controllers/v1/interfaces/IBranchController";
import { ITenantController } from "../../controllers/v1/interfaces/ITenantController";



const router = Router();

const branchController = container.get<IBranchController>("IBranchController")
const tenantController = container.get<ITenantController>("ITenantController")

router.post('/tenants', userAuth, checkSchema(tenantValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => tenantController.createTenant(req, res, next))
router.post('/tenants/branches', userAuth, tenantAuth, checkSchema(branchValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.createBranch(req, res, next))
router.get('/tenants/branches', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.getAllBranches(req, res, next)
)
router.get('/tenants/:name', getSpecificTenantController)
router.get('/tenants/branches/:branchId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.getSpecificBranch(req, res, next)
)
router.put('/tenants/branches/:branchId', userAuth, tenantAuth, checkSchema(branchValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.updateBranch(req, res, next)
)
router.delete('/tenants/branches/:branchId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => branchController.deleteBranch(req, res, next)
)



export default router