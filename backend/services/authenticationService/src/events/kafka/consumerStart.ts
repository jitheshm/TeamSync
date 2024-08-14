
import { IConsumer } from "teamsync-common"
import BranchConsumer from "./consumers/BranchConsumer"
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"
import { container } from "../../config/inversify/inversify"

export const connectConsumers = () => {
    const branchConsumer = container.get<IConsumer>("IBranchConsumer");


    let userConsumer: UserConsumer = new UserConsumer()
    let tenantConsumer: TenantConsumer = new TenantConsumer()

    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    let subscriptionConsumer: IConsumer = new SubscriptionConsumer
    subscriptionConsumer.consume()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()

} 