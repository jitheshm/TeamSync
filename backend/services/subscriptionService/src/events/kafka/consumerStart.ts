
import { container } from "../../config/inversify/inversify"
import IConsumer from "../../interfaces/IConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    const userConsumer= container.get<IConsumer>("IUserConsumer")
    const tenantConsumer= container.get<IConsumer>("ITenantConsumer")
    tenantConsumer.consume()
    userConsumer.consume()
} 