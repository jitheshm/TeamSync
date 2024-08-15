import { NextFunction, Router, Request, Response } from "express";
import userAuth from "../../middlewares/userAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import { checkSchema } from "express-validator";
import projectValidator from "../../validators/projectValidator";
import getAllProjectController from "../../controllers/getAllProjectController";
import fetchAvailableTenantUsersController from "../../controllers/fetchAvailableTenantUsersController";
import ticketCreateController from "../../controllers/ticketCreateController";
import ticketValidators from "../../validators/ticketValidators";
import ticketUpdateController from "../../controllers/ticketUpdateController";
import ticketUpdateStatusController from "../../controllers/ticketUpdateStatusController";
import ticketDeleteController from "../../controllers/ticketDeleteController";
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
router.get('/projects/recent/tenant', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchRecentProjects(req, res, next)
)
router.get('/projects/stats', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchProjectStats(req, res, next)
)
router.get('/projects/branches/stats', userAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchBranchProjectCount(req, res, next)
)
router.post('/projects', userAuth, tenantAuth, checkSchema(projectValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.createProject(req, res, next))

router.put('/projects/:projectId', userAuth, tenantAuth, checkSchema(projectValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.projectUpdate(req, res, next))

router.put('/projects/:projectId/status', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.projectStatusUpdate(req, res, next)
)
router.delete('/projects/:projectId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.projectDelete(req, res, next)
)
router.get('/projects', userAuth, tenantAuth, getAllProjectController)
router.get('/projects/:projectId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.getSpecificProject(req, res, next)
)
router.get('/projects/:projectId/details', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.getProjectDetails(req, res, next)
)

router.post('/projects/:projectId/tasks', userAuth, tenantAuth, checkSchema(taskValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.createTask(req, res, next)
)

router.get('/tenants/users/available', userAuth, fetchAvailableTenantUsersController)
router.get('/projects/:projectId/users/available', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => projectController.fetchProjectUsers(req, res, next)
)
router.get('/projects/:projectId/tasks', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.fetchProjectTasks(req, res, next)
)
router.put('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, checkSchema(taskValidator()), formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.taskUpdate(req, res, next))
router.delete('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth, 
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.taskDelete(req, res, next)
)
router.get('/projects/:projectId/tasks/:taskId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.fetchProjectTaskDetails(req, res, next)
)
router.put('/projects/:projectId/tasks/:taskId/status', userAuth, tenantAuth, 
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.taskStatusUpdate(req, res, next)
)
router.post('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketCreateController)
router.put('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, checkSchema(ticketValidators()), ticketUpdateController)
router.patch('/projects/:projectId/tasks/:taskId/tickets/:ticketId/status', userAuth, tenantAuth, ticketUpdateStatusController)
router.delete('/projects/:projectId/tasks/:taskId/tickets/:ticketId', userAuth, tenantAuth, ticketDeleteController)
router.get('/projects/:projectId/tasks/:taskId/tickets', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => ticketController.fetchProjectTickets(req, res, next)
)
router.get('/projects/:projectId/tickets/:ticketId', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => ticketController.fetchTicketDetails(req, res, next)
)
router.get('/projects/tasks/stats', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => taskController.fetchTaskStats(req, res, next)
)
router.get('/projects/ticket/stats', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => ticketController.fetchTicketStats(req, res, next)
)
router.post('/todo', userAuth, tenantAuth, formValidation,
    (req: CustomRequest, res: Response, next: NextFunction) => todoController.createTodo(req, res, next)
)
router.get('/todo', userAuth, tenantAuth,
    (req: CustomRequest, res: Response, next: NextFunction) => todoController.fetchTodo(req, res, next)
)
router.put('/todo/:todoId', userAuth, tenantAuth, updateTodoController)








export default router