
import { IConsumer } from "teamsync-common"
import BranchConsumer from "./consumers/BranchConsumer"
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"
import { container } from "../../config/inversify/inversify"

export const connectConsumers = () => {
    const branchConsumer = container.get<IConsumer>("IBranchConsumer");
    const subscriptionConsumer = container.get<IConsumer>("ISubscriptionConsumer");
    const tenantConsumer = container.get<IConsumer>("ITenantConsumer");


    let userConsumer: UserConsumer = new UserConsumer()

    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    subscriptionConsumer.consume()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()

} 