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






export { container };