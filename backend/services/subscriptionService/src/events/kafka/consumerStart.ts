
import IConsumer from "../../interfaces/IConsumer"
import TenantConsumer from "./consumers/TenantConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer:UserConsumer = new UserConsumer()
    let tenantConsumer:TenantConsumer = new TenantConsumer()
    tenantConsumer.consume()
    userConsumer.consume()
} 