import { Container } from "inversify";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { KafkaConnection } from "../kafka/KafkaConnection";
import { ITenantUserService } from "../../services/interfaces/ITenantUserService";
import TenantUserService from "../../services/implementations/TenantUserService";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchService } from "../../services/interfaces/IBranchService";
import BranchService from "../../services/implementations/BranchService";
import IConsumer from "../../interfaces/IConsumer";
import BranchConsumer from "../../events/kafka/consumers/BranchConsumer";
import ProjectConsumer from "../../events/kafka/consumers/ProjectConsumer";
import ProjectService from "../../services/implementations/ProjectService";
import { IProjectService } from "../../services/interfaces/IProjectService";
import TenantUserConsumer from "../../events/kafka/consumers/TenantUserConsumer";
import MeetingConsumer from "../../events/kafka/consumers/MeeetingConsumer";
import MeetingService from "../../services/implementations/MeetingService";
import { IMeetingService } from "../../services/interfaces/IMeetingService";
import OtpConsumer from "../../events/kafka/consumers/OtpConsumer";
import TaskConsumer from "../../events/kafka/consumers/TaskConsumer";
import { ITaskService } from "../../services/interfaces/ITaskService";
import TaskService from "../../services/implementations/TaskService";




const container = new Container();

container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<ITenantUserService>("ITenantUserService").to(TenantUserService);
container.bind<ITenantUserRepository>("ITenantUserRepository").to(TenantUserRepository);
container.bind<IBranchRepository>("IBranchRepository").to(BranchRepository);
container.bind<IBranchService>("IBranchService").to(BranchService);
container.bind<IConsumer>("IBranchConsumer").to(BranchConsumer);
container.bind<IConsumer>("IProjectConsumer").to(ProjectConsumer);
container.bind<IProjectService>("IProjectService").to(ProjectService);
container.bind<IConsumer>("ITenantUserConsumer").to(TenantUserConsumer);
container.bind<IConsumer>("IMeetingConsumer").to(MeetingConsumer);
container.bind<IMeetingService>("IMeetingService").to(MeetingService);
container.bind<IConsumer>("IOtpConsumer").to(OtpConsumer);
container.bind<IConsumer>("ITaskConsumer").to(TaskConsumer);
container.bind<ITaskService>("ITaskService").to(TaskService);
// container.bind<IMiddlewareService>("IMiddlewareService").to(MiddlewareServices);











export { container };