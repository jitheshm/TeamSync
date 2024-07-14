import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import UserRepository from "../../../repository/implementations/UserRepository";
import { UserService } from "../../../services/implementations/UserService";



export default class UserConsumer implements IConsumer {
    private userService: UserService;

    constructor() {
        const userRepository = new UserRepository();
        this.userService = new UserService({ userRepository });
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_user_group`);
            await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("User consumer received a message.");
                    const data = message.value?.toString();
                    console.log(data);

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);

                        const origin = message.headers?.origin?.toString();
                        if (origin !== process.env.SERVICE) {
                            await this.userService.handleUserEvent(dataObj.eventType, dataObj);
                        }
                    }
                },
            });

            console.log("Subscribed to user-events topic.");
        } catch (error) {
            console.error("Error in consuming messages:", error);
        }
    }
}
