
import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { ISubscriptionService } from "../../../services/interfaces/ISubscriptionService";
import { IKafkaConnection } from "teamsync-common";


@injectable()
export default class SubscriptionConsumer implements IConsumer {

    private subscriptionService: ISubscriptionService
    private kafkaConnection: IKafkaConnection

    constructor(
        @inject("ISubscriptionService") subscriptionService: ISubscriptionService,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection
    ) {
        this.subscriptionService = subscriptionService
        this.kafkaConnection = kafkaConnection
    }

    async consume() {
        try {
            let consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_sub_group`)
            await consumer.subscribe({ topic: 'sub-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new sub consumer");
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new sub consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            this.subscriptionService.handleKafkaEvent(dataObj)

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