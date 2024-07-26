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
import fetchProjectTasks from "../../controllers/fetchProjectTasks";
import taskUpdateController from "../../controllers/taskUpdateController";
import taskDeleteController from "../../controllers/taskDeleteController";
import fetchProjectTasksDetails from "../../controllers/fetchProjectTasksDetails";
import projectStatusUpdateController from "../../controllers/projectStatusUpdateController";
import taskStatusUpdateController from "../../controllers/taskStatusUpdateController";
import ticketCreateController from "../../controllers/ticketCreateController";
import fileUpload from "../../middlewares/fileUpload";
import ticketValidators from "../../validators/ticketValidators";
import ticketUpdateController from "../../controllers/ticketUpdateController";
import ticketUpdateStatusController from "../../controllers/ticketUpdateStatusController";
import ticketDeleteController from "../../controllers/ticketDeleteController";
import fetchProjectTickets from "../../controllers/fetchProjectTickets";
import fetchTicketDetails from "../../controllers/fetchTicketDetails";
import fetchRecentProjects from "../../controllers/fetchRecentProjects";
import fetchProjectStats from "../../controllers/fetchProjectStats";
import fetchTaskStats from "../../controllers/fetchTaskStats";
import fetchTicketStats from "../../controllers/fetchTicketStats";




const router = Router();

router.get('/projects/recent', userAuth, tenantAuth, fetchRecentProjects)
router.get('/projects/stats', userAuth, tenantAuth, fetchProjectStats)
router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), projectController)
router.put('/projects/:projectId', userAuth, tenantAuth, checkSchema(projectValidator()), projectUpdateController)
router.put('/projects/:projectId/status', userAuth, tenantAuth, projectStatusUpdateController)
router.delete('/projects/:projectId', userAuth, tenantAuth, projectDeleteController)
router.get('/projects', userAuth, tenantAuth, getAllProjectController)
router.get('/projects/:projectId', userAuth, tenantAuth, getSpecificProjectController)
router.get('/projects/:projectId/details', userAuth, tenantAuth, getProjectDetails)
router.post('/projects/:projectId/tasks', userAuth, tenantAuth, createTaskController)
router.get('/tenants/users/available', userAuth, fetchAvailableTenantUsersController)
router.get('/projects/:projectId/users/available', userAuth, tenantAuth, fetchProjectUsers)
router.get('/projects/:projectId/tasks', userAuth, tenantAuth, fetchProjectTasks)
router.put('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, taskUpdateController)
router.delete('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, taskDeleteController)
router.get('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, fetchProjectTasksDetails)
router.put('/projects/:projectId/tasks/:taskId/status', userAuth, tenantAuth, taskStatusUpdateController)
router.post('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, checkSchema(ticketValidators()), fileUpload('ticket-files'), ticketCreateController)
router.put('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, checkSchema(ticketValidators()), fileUpload('ticket-files'), ticketUpdateController)
router.patch('/projects/:projectId/tasks/:taskId/tickets/:ticketId/status', userAuth, tenantAuth, ticketUpdateStatusController)
router.delete('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, ticketDeleteController)
router.get('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, fetchProjectTickets)
router.get('/projects/:projectId/tickets/:ticketId', userAuth, tenantAuth, fetchTicketDetails)
router.get('/projects/tasks/stats', userAuth, tenantAuth, fetchTaskStats)
router.get('/projects/ticket/stats', userAuth, tenantAuth, fetchTicketStats)







export default router