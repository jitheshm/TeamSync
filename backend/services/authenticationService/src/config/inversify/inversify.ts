import { Container } from "inversify";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import AdminRepository from "../../repository/implementations/adminRepository";
import { IAdminService } from "../../services/interfaces/IAdminService";
import AdminService from "../../services/implementations/AdminService";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { AdminController } from "../../controllers/v1/implementations/AdminController";
import { KafkaConnection } from "../kafka/KafkaConnection";
import IUserController from "../../controllers/v1/interfaces/IUserController";
import { UserController } from "../../controllers/v1/implementations/UserController";
import UserService from "../../services/implementations/UserService";
import { IUserService } from "../../services/interfaces/IUserService";
import { IUserRepository } from "../../repository/interface/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import { ISubscriptionRepository } from "../../repository/interface/ISubscriptionRepository";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { ITenantUserRepository } from "../../repository/interface/ITenantUserRepository";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { IOtpRepository } from "../../repository/interface/IOtpRepository";
import OtpRepository from "../../repository/implementations/OtpRepository";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { IBranchRepository } from "../../repository/interface/IBranchRepository";
import BranchRepository from "../../repository/implementations/BranchRepository";
import IBranchService from "../../services/interfaces/IBranchService";
import BranchService from "../../services/implementations/BranchService";
import BranchConsumer from "../../events/kafka/consumers/BranchConsumer";
import ISubscriptionService from "../../services/interfaces/ISubscriptionService";
import SubscriptionService from "../../services/implementations/SubscriptionService";
import SubscriptionConsumer from "../../events/kafka/consumers/SubscriptionConsumer";
import { ITenantRepository } from "../../repository/interface/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import ITenantService from "../../services/interfaces/ITenantService";
import TenantService from "../../services/implementations/TenantService";
import TenantConsumer from "../../events/kafka/consumers/TenantConsumer";
import TenantUserConsumer from "../../events/kafka/consumers/TenantUserConsumer";


const container = new Container();

container.bind<IAdminController>("IAdminController").to(AdminController);
container.bind<IAdminService>("IAdminService").to(AdminService);
container.bind<IAdminRepository>("IAdminRepository").to(AdminRepository);
container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<IUserController>("IUserController").to(UserController);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);
container.bind<ITenantUserRepository>("ITenantUserRepository").to(TenantUserRepository);
container.bind<IOtpRepository>("IOtpRepository").to(OtpRepository);
container.bind<IBranchRepository>("IBranchRepository").to(BranchRepository);
container.bind<IBranchService>("IBranchService").to(BranchService);
container.bind<IConsumer>("IBranchConsumer").to(BranchConsumer);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<IConsumer>("ISubscriptionConsumer").to(SubscriptionConsumer);
container.bind<ITenantRepository>("ITenantRepository").to(TenantRepository);
container.bind<ITenantService>("ITenantService").to(TenantService);
container.bind<IConsumer>("ITenantConsumer").to(TenantConsumer);
container.bind<IConsumer>("ITenantUserConsumer").to(TenantUserConsumer);






export { container };