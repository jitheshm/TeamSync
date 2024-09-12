
import { IConsumer } from "teamsync-common"
import { container } from "../../config/inversify/inversify"

export const connectConsumers = () => {
    const userConsumer = container.get<IConsumer>("IUserConsumer")
    const tenantConsumer = container.get<IConsumer>("ITenantConsumer")
    const branchConsumer = container.get<IConsumer>("IBranchConsumer")
    const tenantUserConsumer = container.get<IConsumer>("ITenantUserConsumer")
    const subscriptionConsumer = container.get<IConsumer>("ISubscriptionConsumer")

    subscriptionConsumer.consume()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()

} 