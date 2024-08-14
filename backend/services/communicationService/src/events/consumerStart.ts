
import { IConsumer } from "teamsync-common"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"
import { container } from "../config/inversify/inversify"

export const connectConsumers = () => {
    const branchConsumer = container.get<IConsumer>("IBranchConsumer");
    const planConsumer = container.get<IConsumer>("IPlanConsumer");
    const projectConsumer = container.get<IConsumer>("IProjectConsumer");
    const subscriptionConsumer=container.get<IConsumer>("ISubscriptionConsumer");

    let userConsumer: IConsumer = new UserConsumer()
    let tenantConsumer: IConsumer = new TenantConsumer()
    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()
    subscriptionConsumer.consume()
    planConsumer.consume()

} 