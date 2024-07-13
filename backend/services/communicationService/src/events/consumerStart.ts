
import IConsumer from "../interfaces/IConsumer"
import BranchConsumer from "./consumers/BranchConsumer"
import PlanConsumer from "./consumers/PlanConsumer"
import ProjectConsumer from "./consumers/ProjectConsumer"
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer: IConsumer = new UserConsumer()
    let tenantConsumer: IConsumer = new TenantConsumer()
    let branchConsumer: IConsumer = new BranchConsumer()
    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    let projectConsumer: IConsumer = new ProjectConsumer()
    let subscriptionConsumer: IConsumer = new SubscriptionConsumer()
    let planConsumer: IConsumer = new PlanConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()
    subscriptionConsumer.consume()
    planConsumer.consume()

} 