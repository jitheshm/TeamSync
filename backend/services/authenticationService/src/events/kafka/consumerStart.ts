
import { IConsumer } from "teamsync-common"
import UserConsumer from "./consumers/UserConsumer"
import { container } from "../../config/inversify/inversify"

export const connectConsumers = () => {
    const branchConsumer = container.get<IConsumer>("IBranchConsumer");
    const subscriptionConsumer = container.get<IConsumer>("ISubscriptionConsumer");
    const tenantConsumer = container.get<IConsumer>("ITenantConsumer");
    const tenantUserConsumer = container.get<IConsumer>("ITenantUserConsumer");


    let userConsumer: UserConsumer = new UserConsumer()

    subscriptionConsumer.consume()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()

} 