
import IConsumer from "../../interfaces/IConsumer"
import TenantConsumer from "./consumers/TenanConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer:IConsumer = new UserConsumer()
    let tenantConsumer:IConsumer = new TenantConsumer()
    userConsumer.consume()
    tenantConsumer.consume()
} 