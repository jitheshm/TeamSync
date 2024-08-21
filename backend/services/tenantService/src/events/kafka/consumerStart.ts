
import { IConsumer } from "teamsync-common"
import { container } from "../../config/inversify/inversify"
import PlanConsumer from "./consumers/PlanConsumer"
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    const subscriptionConsumer = container.get<IConsumer>("ISubscriptionConsumer")
    const planConsumer = container.get<IConsumer>("IPlanConsumer")
    const userConsumer = container.get<IConsumer>("IUserConsumer")
    userConsumer.consume()
    subscriptionConsumer.consume()
    planConsumer.consume()
} 