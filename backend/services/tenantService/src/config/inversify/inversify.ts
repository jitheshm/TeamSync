import { Container, interfaces } from "inversify";
import { KafkaConnection } from "../kafka/KafkaConnection";
import { IConsumer, IKafkaConnection, IProducer } from "teamsync-common";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import UserConsumer from "../../events/kafka/consumers/UserConsumer";
import { Producer } from "kafkajs";
import { ISubscriptionService } from "../../services/interfaces/ISubscriptionService";
import { SubscriptionService } from "../../services/implementations/SubscriptionService";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { IUserService } from "../../services/interfaces/IUserService";
import { UserService } from "../../services/implementations/UserService";
import { ITenantService } from "../../services/interfaces/ITenantService";
import { TenantService } from "../../services/implementations/TenantService";
import { IMiddlewareService } from "../../services/interfaces/IMiddlewareService";
import { MiddlewareServices } from "../../services/implementations/MiddlewareServices";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import { IBranchRepository } from "../../repository/interfaces/IBranchRepository";
import BranchRepository from "../../repository/implementations/BranchRepository";
import { IBranchService } from "../../services/interfaces/IBranchService";
import { BranchService } from "../../services/implementations/BranchService";
import { IBranches } from "../../entities/BranchEntity";
import BranchProducer from "../../events/kafka/producers/BranchProducer";
import { IBranchController } from "../../controllers/v1/interfaces/IBranchController";
import { BranchController } from "../../controllers/v1/implementations/BranchController";
import { ITenants } from "../../entities/TenantEntity";
import TenantProducer from "../../events/kafka/producers/TenantProducer";
import { PlanService } from "../../services/implementations/PlanService";
import { IPlanService } from "../../services/interfaces/IPlanService";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanRepository from "../../repository/implementations/PlanRepository";


const container = new Container();

container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IBranchRepository>("IBranchRepository").to(BranchRepository);
container.bind<IBranchService>("IBranchService").to(BranchService)
container.bind<ITenantRepository>("ITenantRepository").to(TenantRepository);
container.bind<ITenantService>("ITenantService").to(TenantService);
container.bind<IPlanService>("IPlanService").to(PlanService);
container.bind<IPlanRepository>("IPlanRepository").to(PlanRepository);
container.bind<IConsumer>("IUserConsumer").to(UserConsumer);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<IMiddlewareService>("IMiddlewareService").to(MiddlewareServices);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);
container.bind<IBranchController>("IBranchController").to(BranchController);



container.bind<IProducer<IBranches>>("IBranchProducer").toFactory((context: interfaces.Context) => {
    return (producer: Producer, dbName: string, modelName: string) => {
        return new BranchProducer(producer, dbName, modelName)
    }
})

container.bind<IProducer<ITenants>>("ITenantProducer").toFactory((context: interfaces.Context) => {
    return (producer: Producer, dbName: string, modelName: string) => {
        return new TenantProducer(producer, dbName, modelName)
    }
})






export { container };