import { NextFunction, Router, Request, Response } from "express";
import userAuth from "../../middlewares/userAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import { checkSchema } from "express-validator";
import projectValidator from "../../validators/projectValidator";
import projectUpdateController from "../../controllers/projectUpdateController";
import projectDeleteController from "../../controllers/projectDeleteController";
import getSpecificProjectController from "../../controllers/getSpecificProjectController";
import getAllProjectController from "../../controllers/getAllProjectController";
import getProjectDetails from "../../controllers/getProjectDetails";
import fetchAvailableTenantUsersController from "../../controllers/fetchAvailableTenantUsersController";
import fetchProjectUsers from "../../controllers/fetchProjectUsers";
import taskUpdateController from "../../controllers/taskUpdateController";
import taskDeleteController from "../../controllers/taskDeleteController";
import projectStatusUpdateController from "../../controllers/projectStatusUpdateController";
import taskStatusUpdateController from "../../controllers/taskStatusUpdateController";
import ticketCreateController from "../../controllers/ticketCreateController";
import ticketValidators from "../../validators/ticketValidators";
import ticketUpdateController from "../../controllers/ticketUpdateController";
import ticketUpdateStatusController from "../../controllers/ticketUpdateStatusController";
import ticketDeleteController from "../../controllers/ticketDeleteController";
import fetchTicketDetails from "../../controllers/fetchTicketDetails";
import fetchTaskStats from "../../controllers/fetchTaskStats";
import fetchTicketStats from "../../controllers/fetchTicketStats";
import fetchRecentProjects from "../../controllers/fetchRecentProjects";
import fetchTodoController from "../../controllers/fetchTodoController";
import updateTodoController from "../../controllers/updateTodoController";
import taskValidator from "../../validators/taskValidator";
import { CustomRequest, formValidation } from "teamsync-common";
import { ITaskController } from "../../controllers/v1/interfaces/ITaskController";
import { container } from "../../config/inversify/inversify";
import { ITodoController } from "../../controllers/v1/interfaces/ITodoController";
import { IProjectController } from "../../controllers/v1/interfaces/IProjectController";
import { ITicketController } from "../../controllers/v1/interfaces/ITicketController";




const router = Router();

const taskController = container.get<ITaskController>("ITaskController");
const todoController = container.get<ITodoController>("ITodoController");
const projectController = container.get<IProjectController>("IProjectController");
const ticketController = container.get<ITicketController>("ITicketController");


router.get('/projects/recent', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchBranchRecentProjects(req, res, next)
)
router.get('/projects/recent/tenant', userAuth, fetchRecentProjects)
router.get('/projects/stats', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchProjectStats(req, res, next)
)
router.get('/projects/branches/stats', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchBranchProjectCount(req, res, next)
)
router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.createProject(req, res, next))

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
router.get('/projects/:projectId/tasks', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.fetchProjectTasks(req, res, next)
)
router.put('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, checkSchema(taskValidator()), taskUpdateController)
router.delete('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, taskDeleteController)
router.get('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.fetchProjectTaskDetails(req, res, next)
)
router.put('/projects/:projectId/tasks/:taskId/status', userAuth, tenantAuth, taskStatusUpdateController)
router.post('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketCreateController)
router.put('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketUpdateController)
router.patch('/projects/:projectId/tasks/:taskId/tickets/:ticketId/status', userAuth, tenantAuth, ticketUpdateStatusController)
router.delete('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, ticketDeleteController)
router.get('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => ticketController.fetchProjectTickets(req, res, next)
)
router.get('/projects/:projectId/tickets/:ticketId', userAuth, tenantAuth, fetchTicketDetails)
router.get('/projects/tasks/stats', userAuth, tenantAuth, fetchTaskStats)
router.get('/projects/ticket/stats', userAuth, tenantAuth, fetchTicketStats)
router.post('/todo', userAuth, tenantAuth, formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => todoController.createTodo(req, res, next)
)
router.get('/todo', userAuth, tenantAuth, fetchTodoController)
router.put('/todo/:todoId', userAuth, tenantAuth, updateTodoController)








export default router