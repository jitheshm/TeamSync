import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import projectController from "../../controllers/projectController";
import { checkSchema } from "express-validator";
import projectValidator from "../../validators/projectValidator";
import projectUpdateController from "../../controllers/projectUpdateController";
import projectDeleteController from "../../controllers/projectDeleteController";
import getSpecificProjectController from "../../controllers/getSpecificProjectController";




const router = Router();

router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), projectController)
router.put('/projects/:projectId', userAuth, tenantAuth, checkSchema(projectValidator()), projectUpdateController)
router.delete('/projects/:projectId', userAuth, tenantAuth, projectDeleteController)
router.get('/projects/:projectId', userAuth, tenantAuth, getSpecificProjectController)


export default router