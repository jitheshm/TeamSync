
import IConsumer from "../../interfaces/IConsumer"
import BranchConsumer from "./consumers/BranchConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer: UserConsumer = new UserConsumer()
    let tenantConsumer: TenantConsumer = new TenantConsumer()
    let branchConsumer: IConsumer = new BranchConsumer()
    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()

} 