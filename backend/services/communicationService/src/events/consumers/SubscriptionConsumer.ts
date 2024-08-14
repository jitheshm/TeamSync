import { IConsumer, IKafkaConnection } from "teamsync-common";
import { ISubscriptionService } from "../../services/interfaces/ISubscriptionService";
import { inject, injectable } from "inversify";


@injectable()
export default class SubscriptionConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection;
    private subscriptionService: ISubscriptionService;

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ISubscriptionService") subscriptionService: ISubscriptionService
    ) {
        this.kafkaConnection = kafkaConnection;
        this.subscriptionService = subscriptionService;
    }
    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_sub_group`);
            await consumer.subscribe({ topic: "sub-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new subscription event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.subscriptionService.handleEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });

            console.log("Subscribed to new subscription topic");
        } catch (error) {
            console.log(error);
        }
    }
}
