import { NextFunction, Router, Request, Response } from "express";
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
import fetchAvailableTenantUsersController from "../../controllers/fetchAvailableTenantUsersController";
import fetchProjectUsers from "../../controllers/fetchProjectUsers";
import fetchProjectTasks from "../../controllers/fetchProjectTasks";
import taskUpdateController from "../../controllers/taskUpdateController";
import taskDeleteController from "../../controllers/taskDeleteController";
import fetchProjectTasksDetails from "../../controllers/fetchProjectTasksDetails";
import projectStatusUpdateController from "../../controllers/projectStatusUpdateController";
import taskStatusUpdateController from "../../controllers/taskStatusUpdateController";
import ticketCreateController from "../../controllers/ticketCreateController";
import ticketValidators from "../../validators/ticketValidators";
import ticketUpdateController from "../../controllers/ticketUpdateController";
import ticketUpdateStatusController from "../../controllers/ticketUpdateStatusController";
import ticketDeleteController from "../../controllers/ticketDeleteController";
import fetchProjectTickets from "../../controllers/fetchProjectTickets";
import fetchTicketDetails from "../../controllers/fetchTicketDetails";
import fetchProjectStats from "../../controllers/fetchProjectStats";
import fetchTaskStats from "../../controllers/fetchTaskStats";
import fetchTicketStats from "../../controllers/fetchTicketStats";
import fetchBranchRecentProjects from "../../controllers/fetchBranchRecentProjects";
import fetchRecentProjects from "../../controllers/fetchRecentProjects";
import fetchBranchProjectCount from "../../controllers/fetchBranchProjectCount";
import fetchTodoController from "../../controllers/fetchTodoController";
import updateTodoController from "../../controllers/updateTodoController";
import taskValidator from "../../validators/taskValidator";
import { CustomRequest, formValidation } from "teamsync-common";
import { ITaskController } from "../../controllers/v1/interfaces/ITaskController";
import { container } from "../../config/inversify/inversify";
import { ITodoController } from "../../controllers/v1/interfaces/ITodoController";




const router = Router();

const taskController = container.get<ITaskController>("ITaskController");
const todoController = container.get<ITodoController>("ITodoController");


router.get('/projects/recent', userAuth, tenantAuth, fetchBranchRecentProjects)
router.get('/projects/recent/tenant', userAuth, fetchRecentProjects)
router.get('/projects/stats', userAuth, tenantAuth, fetchProjectStats)
router.get('/projects/branches/stats', userAuth, fetchBranchProjectCount)
router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), projectController)
router.put('/projects/:projectId', userAuth, tenantAuth, checkSchema(projectValidator()), projectUpdateController)
router.put('/projects/:projectId/status', userAuth, tenantAuth, projectStatusUpdateController)
router.delete('/projects/:projectId', userAuth, tenantAuth, projectDeleteController)
router.get('/projects', userAuth, tenantAuth, getAllProjectController)
router.get('/projects/:projectId', userAuth, tenantAuth, getSpecificProjectController)
router.get('/projects/:projectId/details', userAuth, tenantAuth, getProjectDetails)

router.post('/projects/:projectId/tasks', userAuth, tenantAuth, checkSchema(taskValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.createTask(req, res, next)
)

router.get('/tenants/users/available', userAuth, fetchAvailableTenantUsersController)
router.get('/projects/:projectId/users/available', userAuth, tenantAuth, fetchProjectUsers)
router.get('/projects/:projectId/tasks', userAuth, tenantAuth, fetchProjectTasks)
router.put('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, checkSchema(taskValidator()), taskUpdateController)
router.delete('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, taskDeleteController)
router.get('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, fetchProjectTasksDetails)
router.put('/projects/:projectId/tasks/:taskId/status', userAuth, tenantAuth, taskStatusUpdateController)
router.post('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketCreateController)
router.put('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketUpdateController)
router.patch('/projects/:projectId/tasks/:taskId/tickets/:ticketId/status', userAuth, tenantAuth, ticketUpdateStatusController)
router.delete('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, ticketDeleteController)
router.get('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, fetchProjectTickets)
router.get('/projects/:projectId/tickets/:ticketId', userAuth, tenantAuth, fetchTicketDetails)
router.get('/projects/tasks/stats', userAuth, tenantAuth, fetchTaskStats)
router.get('/projects/ticket/stats', userAuth, tenantAuth, fetchTicketStats)
router.post('/todo', userAuth, tenantAuth, formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => todoController.createTodo(req, res, next)
)
router.get('/todo', userAuth, tenantAuth, fetchTodoController)
router.put('/todo/:todoId', userAuth, tenantAuth, updateTodoController)








export default router