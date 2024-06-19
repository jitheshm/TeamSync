
import UserConsumer from "./consumers/UserConsumer"

export const connectConsumers = () => {
    let userConsumer:UserConsumer = new UserConsumer()
    userConsumer.consume()
} 