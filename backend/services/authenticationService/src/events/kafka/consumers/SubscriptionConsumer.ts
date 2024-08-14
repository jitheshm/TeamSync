
import { IConsumer } from "teamsync-common";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import SubscriptionRepository from "../../../repository/implementations/SubscriptionRepository";



export default class SubscriptionConsumer implements IConsumer {

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_sub_group`)
            await consumer.subscribe({ topic: 'sub-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new sub consumer");
                    let subscriptionRepository = new SubscriptionRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new sub consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':

                                    await subscriptionRepository.create(dataObj.data)
                                    break;
                                case 'update':
                                    await subscriptionRepository.update(dataObj.data)
                                    break;
                            }
                        }

                    }
                },
            })
            console.log("subscribed to new sub topic");

        } catch (error) {
            console.log(error);

        }
    }

}