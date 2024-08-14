import { Container } from "inversify";
import MeetingRepository from "../../repository/implementations/MeetingRepository";
import { IMeetingService } from "../../services/interfaces/IMeetingService";
import MeetingService from "../../services/implementations/MeetingService";
import { IMeetingRepository } from "../../repository/interfaces/IMeetingRepository";
import { IMeetingController } from "../../controllers/interfaces/IMeetingController";
import { MeetingController } from "../../controllers/implementations/MeetingController";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { KafkaConnection } from "../kafka/KafkaConnection";
import { IChatService } from "../../services/interfaces/IChatService";
import ChatService from "../../services/implementations/ChatService";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";
import ChatRepository from "../../repository/implementations/ChatRepository";
import { IMessageService } from "../../services/interfaces/IMessageService";
import MessageService from "../../services/implementations/MessageService";
import { IMessageRepository } from "../../repository/interfaces/IMessageRepository";
import MessageRepository from "../../repository/implementations/MessageRepository";
import { IChatNotificationService } from "../../services/interfaces/IChatNotificationService";
import ChatNotificationService from "../../services/implementations/ChatNotificationService";
import { IChatNotificationRepository } from "../../repository/interfaces/IChatNotificationRepository";
import ChatNotificationRepository from "../../repository/implementations/ChatNotificationRepository";
import { ITenantUserService } from "../../services/interfaces/ITenantUserService";
import TenantUserService from "../../services/implementations/TenantUserService";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import { IBranchService } from "../../services/interfaces/IBranchService";
import BranchService from "../../services/implementations/BranchService";
import BranchRepository from "../../repository/implementations/BranchRepository";
import BranchConsumer from "../../events/consumers/BranchConsumer";
import PlanConsumer from "../../events/consumers/PlanConsumer";
import { IPlanService } from "../../services/interfaces/IPlanService";
import PlanService from "../../services/implementations/PlanService";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanRepository from "../../repository/implementations/PlanRepository";
import ProjectConsumer from "../../events/consumers/ProjectConsumer";
import { IProjectService } from "../../services/interfaces/IProjectService";
import ProjectService from "../../services/implementations/ProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import ProjectRepository from "../../repository/implementations/ProjectRepository";



const container = new Container();

container.bind<IMeetingRepository>("IMeetingRepository").to(MeetingRepository);
container.bind<IMeetingService>("IMeetingService").to(MeetingService);
container.bind<IMeetingController>("IMeetingController").to(MeetingController);
container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<IChatService>("IChatService").to(ChatService);
container.bind<IChatRepository>("IChatRepository").to(ChatRepository);
container.bind<IMessageService>("IMessageService").to(MessageService);
container.bind<IMessageRepository>("IMessageRepository").to(MessageRepository);
container.bind<IChatNotificationService>("IChatNotificationService").to(ChatNotificationService);
container.bind<IChatNotificationRepository>("IChatNotificationRepository").to(ChatNotificationRepository);
container.bind<ITenantUserService>("ITenantUserService").to(TenantUserService);
container.bind<ITenantUserRepository>("ITenantUserRepository").to(TenantUserRepository);
container.bind<IBranchRepository>("IBranchRepository").to(BranchRepository);
container.bind<IBranchService>("IBranchService").to(BranchService);
container.bind<IConsumer>("IBranchConsumer").to(BranchConsumer);
container.bind<IConsumer>("IPlanConsumer").to(PlanConsumer);
container.bind<IPlanService>("IPlanService").to(PlanService);
container.bind<IPlanRepository>("IPlanRepository").to(PlanRepository);
container.bind<IConsumer>("IProjectConsumer").to(ProjectConsumer);
container.bind<IProjectService>("IProjectService").to(ProjectService);
container.bind<IProjectRepository>("IProjectRepository").to(ProjectRepository);











export { container };