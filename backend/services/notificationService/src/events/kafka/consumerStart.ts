

import IConsumer from "../../interfaces/IConsumer"
import BranchConsumer from "./consumers/BranchConsumer"
import OtpConsumer from "./consumers/OtpConsumer"
import ProjectConsumer from "./consumers/ProjectConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"

export const connectConsumers = () => {
    let otpConsumer:OtpConsumer = new OtpConsumer()
    let branchConsumer:IConsumer=new BranchConsumer()
    let tenantUserConsumer:IConsumer=new TenantUserConsumer()
    let projectConsumer:IConsumer=new ProjectConsumer()

    otpConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()
} 