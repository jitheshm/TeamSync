import { IConsumer, IKafkaConnection } from "teamsync-common";
import { IUserService } from "../../services/interfaces/IUserService";
import { inject, injectable } from "inversify";



@injectable()
export default class UserConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection;
    private userService: IUserService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IUserService") userService: IUserService
    ) {
        this.kafkaConnection = kafkaConnection
        this.userService = userService
    }
    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_user_group`);
            await consumer.subscribe({ topic: "user-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new user event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.userService.handleEvent(dataObj.eventType, dataObj.data);
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
