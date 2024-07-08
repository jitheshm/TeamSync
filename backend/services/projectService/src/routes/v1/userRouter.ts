import { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import projectController from "../../controllers/projectController";
import { checkSchema } from "express-validator";
import projectValidator from "../../validators/projectValidator";
import projectUpdateController from "../../controllers/projectUpdateController";
import projectDeleteController from "../../controllers/projectDeleteController";
import getSpecificProjectController from "../../controllers/getSpecificProjectController";
import getAllProjectController from "../../controllers/getAllProjectController";
import getProjectDetails from "../../controllers/getProjectDetails";
import createTaskController from "../../controllers/createTaskController";
import fetchAvailableTenantUsersController from "../../controllers/fetchAvailableTenantUsersController";
import fetchProjectUsers from "../../controllers/fetchProjectUsers";




const router = Router();

router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), projectController)
router.put('/projects/:projectId', userAuth, tenantAuth, checkSchema(projectValidator()), projectUpdateController)
router.delete('/projects/:projectId', userAuth, tenantAuth, projectDeleteController)
router.get('/projects', userAuth, tenantAuth, getAllProjectController)
router.get('/projects/:projectId', userAuth, tenantAuth, getSpecificProjectController)
router.get('/projects/:projectId/details', userAuth, tenantAuth, getProjectDetails)
router.post('/projects/:projectId/tasks', userAuth, tenantAuth, createTaskController)
router.get('/tenants/users/available', userAuth, fetchAvailableTenantUsersController)
router.get('/projects/:projectId/users/available', userAuth, tenantAuth, fetchProjectUsers)




export default router