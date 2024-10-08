import { Container } from "inversify";
import { KafkaConnection } from "../kafka/KafkaConnection";
import { UserService } from "../../services/implementations/UserService";
import { IUserService } from "../../services/interfaces/IUserService";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchService } from "../../services/interfaces/IBranchService";
import { BranchService } from "../../services/implementations/BranchService";
import BranchConsumer from "../../events/kafka/consumers/BranchConsumer";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import { ITenantService } from "../../services/interfaces/ITenantService";
import TenantService from "../../services/implementations/TenantService";
import TenantConsumer from "../../events/kafka/consumers/TenantConsumer";
import TenantUserConsumer from "../../events/kafka/consumers/TenantUserConsumer";
import UserConsumer from "../../events/kafka/consumers/UserConsumer";
import { ITodoController } from "../../controllers/v1/interfaces/ITodoController";
import { TodoController } from "../../controllers/v1/implementations/TodoController";
import { ITodoRepository } from "../../repository/interfaces/ITodoRepository";
import TodoRepository from "../../repository/implementations/TodoRepository";
import { IProjectController } from "../../controllers/v1/interfaces/IProjectController";
import { ProjectController } from "../../controllers/v1/implementations/ProjectController";
import { IProjectService } from "../../services/interfaces/IProjectService";
import ProjectService from "../../services/implementations/ProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import ProjectRepository from "../../repository/implementations/ProjectRepository";
import { ITenantUserController } from "../../controllers/v1/interfaces/ITenantUserController";
import { TenantUserController } from "../../controllers/v1/implementations/TenantUserController";
import { ISubscriptionService } from "../../services/interfaces/ISubscriptionService";
import { SubscriptionService } from "../../services/implementations/SubscriptionService";
import { IMiddlewareService } from "../../services/interfaces/IMiddlewareService";
import { MiddlewareServices } from "../../services/implementations/MiddlewareServices";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { ITaskController } from "../../controllers/v1/interfaces/ITaskController";
import { TaskController } from "../../controllers/v1/implementations/TaskController";
import { ITasks } from "../../entities/TaskEntity";
import { ITaskService } from "../../services/interfaces/ITaskService";
import TaskService from "../../services/implementations/TaskService";
import { ITaskRepository } from "../../repository/interfaces/ITaskRepository";
import TaskRepository from "../../repository/implementations/TaskRepository";
import { ITodoService } from "../../services/interfaces/ITodoService";
import TodoService from "../../services/implementations/TodoService";
import { ITicketController } from "../../controllers/v1/interfaces/ITicketController";
import { TicketController } from "../../controllers/v1/implementations/TicketController";
import { ITicketService } from "../../services/interfaces/ITicketService";
import TicketService from "../../services/implementations/TicketService";
import { ITicketRepository } from "../../repository/interfaces/ITicketRepository";
import TicketRepository from "../../repository/implementations/TicketRepository";
import { ITenantUserService } from "../../services/interfaces/ITenantUserService";
import TenantUserService from "../../services/implementations/TenantUserService";
import SubscriptionConsumer from "../../events/kafka/consumers/SubscriptionConsumer";


const container = new Container();

container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<ITenantUserRepository>("ITenantUserRepository").to(TenantUserRepository);
container.bind<IBranchRepository>("IBranchRepository").to(BranchRepository);
container.bind<IBranchService>("IBranchService").to(BranchService);
container.bind<IConsumer>("IBranchConsumer").to(BranchConsumer);
container.bind<ITenantRepository>("ITenantRepository").to(TenantRepository);
container.bind<ITenantService>("ITenantService").to(TenantService);
container.bind<IConsumer>("ITenantConsumer").to(TenantConsumer);
container.bind<IConsumer>("ITenantUserConsumer").to(TenantUserConsumer);
container.bind<IConsumer>("IUserConsumer").to(UserConsumer);
container.bind<ITodoController>("ITodoController").to(TodoController);
container.bind<ITodoRepository>("ITodoRepository").to(TodoRepository);
container.bind<IProjectController>("IProjectController").to(ProjectController);
container.bind<IProjectService>("IProjectService").to(ProjectService);
container.bind<IProjectRepository>("IProjectRepository").to(ProjectRepository);
container.bind<ITenantUserController>("ITenantUserController").to(TenantUserController)
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<IMiddlewareService>("IMiddlewareService").to(MiddlewareServices);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);
container.bind<ITaskController>("ITaskController").to(TaskController);
container.bind<ITaskService>("ITaskService").to(TaskService);
container.bind<ITaskRepository>("ITaskRepository").to(TaskRepository);
container.bind<ITodoService>("ITodoService").to(TodoService);
container.bind<ITicketController>("ITicketController").to(TicketController);
container.bind<ITicketService>("ITicketService").to(TicketService);
container.bind<ITicketRepository>("ITicketRepository").to(TicketRepository);
container.bind<ITenantUserService>("ITenantUserService").to(TenantUserService);
container.bind<IConsumer>("ISubscriptionConsumer").to(SubscriptionConsumer);







export { container };