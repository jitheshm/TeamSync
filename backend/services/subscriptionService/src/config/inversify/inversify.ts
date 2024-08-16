import { Container, interfaces } from "inversify";
import { KafkaConnection } from "../kafka/KafkaConnection";
import { IConsumer, IKafkaConnection, IProducer } from "teamsync-common";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import UserRepository from "../../repository/implementations/UserRepository";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";
import UserConsumer from "../../events/kafka/consumers/UserConsumer";
import TenantConsumer from "../../events/kafka/consumers/TenantConsumer";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import ISubscriptions from "../../entities/SubscriptionEntity";
import SubscriptionProducer from "../../events/kafka/producers/SubscriptionProducer";
import { Producer } from "kafkajs";
import { ISubscriptionService } from "../../services/interfaces/ISubscriptionService";
import { SubscriptionService } from "../../services/implementations/SubscriptionService";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import IPlan from "../../entities/PlanEntity";
import PlanProducer from "../../events/kafka/producers/PlanProducer";
import { IUserService } from "../../services/interfaces/IUserService";
import { UserService } from "../../services/implementations/UserService";
import { ITenantService } from "../../services/interfaces/ITenantService";
import { TenantService } from "../../services/implementations/TenantService";


const container = new Container();

container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<ITenantRepository>("ITenantRepository").to(TenantRepository);
container.bind<ITenantService>("ITenantService").to(TenantService);
container.bind<IConsumer>("ITenantConsumer").to(TenantConsumer);
container.bind<IConsumer>("IUserConsumer").to(UserConsumer);
container.bind<ISubscriptionService>("ISubscriptionService").to(SubscriptionService);
container.bind<IMiddlewareService>("IMiddlewareService").to(MiddlewareServices);
container.bind<ISubscriptionRepository>("ISubscriptionRepository").to(SubscriptionRepository);

container.bind<IProducer<ISubscriptions>>("ISubscriptionProducer").toFactory((context: interfaces.Context) => {
    return (producer: Producer, dbName: string, modelName: string) => {
        return new SubscriptionProducer(producer, dbName, modelName)
    }
})

container.bind<IProducer<IPlan>>("IPlanProducer").toFactory((context: interfaces.Context) => {
    return (producer: Producer, dbName: string, modelName: string) => {
        return new PlanProducer(producer, dbName, modelName)
    }
})






export { container };