import { IConsumer, IKafkaConnection } from "teamsync-common";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import SubscriptionRepository from "../../repository/implementations/SubscriptionRepository";
import { ISubscriptionRepository } from "../../repository/interfaces/ISubscriptionRepository";
import SubscriptionService from "../../services/implementations/SubscriptionService";
import { ISubscriptionService } from "../../services/interfaces/ISubscriptionService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const subscriptionRepository:ISubscriptionRepository = new SubscriptionRepository();
const subscriptionService:ISubscriptionService = new SubscriptionService(subscriptionRepository);

export default class SubscriptionConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_sub_group`);
            await consumer.subscribe({ topic: "sub-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new subscription event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await subscriptionService.handleEvent(dataObj.eventType, dataObj.data);
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
