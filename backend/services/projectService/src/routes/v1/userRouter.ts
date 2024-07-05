import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import projectController from "../../controllers/projectController";
import { checkSchema } from "express-validator";
import projectValidator from "../../validators/projectValidator";




const router = Router();

router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), projectController)


export default router