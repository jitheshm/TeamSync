
import { inject, injectable } from "inversify";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import { IUserService } from "../../../services/interfaces/IUserService";
import { IConsumer } from "teamsync-common";

@injectable()
export default class UserConsumer implements IConsumer {
    private userService: IUserService;

    constructor(
        @inject("IUserService") userService: IUserService
    ) {
        this.userService = userService
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_user_group`);
            await consumer.subscribe({ topic: 'user-events', fromBeginning: true });
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("I am a new user consumer");
                    const data = message.value?.toString();
                    console.log(data);
                    console.log("I am a new user consumer");

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.userService.handleKafkaEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });
            console.log("Subscribed to new user topic");

        } catch (error) {
            console.log(error);
        }
    }
}
