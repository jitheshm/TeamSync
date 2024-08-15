

import { container } from "../../config/inversify/inversify"
import IConsumer from "../../interfaces/IConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import TicketConsumer from "./consumers/TicketConsumer"

export const connectConsumers = () => {
    const branchConsumer=container.get<IConsumer>("IBranchConsumer")
    const meetingConsumer=container.get<IConsumer>("IMeetingConsumer")
    const otpConsumer=container.get<IConsumer>("IOtpConsumer")
    const projectConsumer=container.get<IConsumer>("IProjectConsumer")
    const taskConsumer=container.get<IConsumer>("ITaskConsumer")


    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    let ticketConsumer: IConsumer = new TicketConsumer()

    otpConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()
    meetingConsumer.consume()
    ticketConsumer.consume()
    taskConsumer.consume()
} 