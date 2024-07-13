
import PlanConsumer from "./consumers/PlanConsumer"
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer: UserConsumer = new UserConsumer()
    let subscriptionConsumer = new SubscriptionConsumer()
    let planConsumer = new PlanConsumer()
    userConsumer.consume()
    subscriptionConsumer.consume()
    planConsumer.consume()
} 