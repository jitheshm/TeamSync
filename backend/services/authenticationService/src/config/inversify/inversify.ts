import { Container } from "inversify";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import AdminRepository from "../../repository/implementations/adminRepository";
import { IAdminService } from "../../services/interfaces/IAdminService";
import AdminService from "../../services/implementations/AdminService";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { AdminController } from "../../controllers/v1/implementations/AdminController";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
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






export { container };