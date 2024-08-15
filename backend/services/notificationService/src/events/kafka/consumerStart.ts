

import { container } from "../../config/inversify/inversify"
import IConsumer from "../../interfaces/IConsumer"
import BranchConsumer from "./consumers/BranchConsumer"
import MeetingConsumer from "./consumers/MeeetingConsumer"
import OtpConsumer from "./consumers/OtpConsumer"
import ProjectConsumer from "./consumers/ProjectConsumer"
import TaskConsumer from "./consumers/TaskConsumer"
import TenantUserConsumer from "./consumers/TenantUserConsumer"
import TicketConsumer from "./consumers/TicketConsumer"

export const connectConsumers = () => {
    const branchConsumer=container.get<IConsumer>("IBranchConsumer")
    const meetingConsumer=container.get<IConsumer>("IMeetingConsumer")

    let otpConsumer: OtpConsumer = new OtpConsumer()
    let tenantUserConsumer: IConsumer = new TenantUserConsumer()
    let projectConsumer: IConsumer = new ProjectConsumer()
    let ticketConsumer: IConsumer = new TicketConsumer()
    let taskConsumer: IConsumer = new TaskConsumer()

    otpConsumer.consume()
    branchConsumer.consume()
    tenantUserConsumer.consume()
    projectConsumer.consume()
    meetingConsumer.consume()
    ticketConsumer.consume()
    taskConsumer.consume()
} 