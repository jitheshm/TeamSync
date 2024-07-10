
import IConsumer from "../interfaces/IConsumer"
import BranchConsumer from "./consumers/BranchConsumer"
import ProjectConsumer from "./consumers/ProjectConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer: IConsumer = new UserConsumer()
    let tenantConsumer: IConsumer = new TenantConsumer()
    let branchConsumer: IConsumer = new BranchConsumer()
    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    let projectConsumer: IConsumer = new ProjectConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()

} 