
import BranchConsumer from "./consumers/BranchConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer: UserConsumer = new UserConsumer()
    let tenantConsumer: TenantConsumer = new TenantConsumer()
    let branchConsumer: BranchConsumer = new BranchConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()

} 