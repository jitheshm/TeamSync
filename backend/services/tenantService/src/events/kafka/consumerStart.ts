
import SubscriptionConsumer from "./consumers/SubscriptionConsumer"
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer:UserConsumer = new UserConsumer()
    let subscriptionConsumer=new SubscriptionConsumer()
    userConsumer.consume()
    subscriptionConsumer.consume()
} 