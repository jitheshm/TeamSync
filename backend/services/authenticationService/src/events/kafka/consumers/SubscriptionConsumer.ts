
import { inject, injectable } from "inversify";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import ISubscriptionService from "../../../services/interfaces/ISubscriptionService";
@injectable()
export default class SubscriptionConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection
    private subscriptionService: ISubscriptionService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ISubscriptionService") subscriptionService: ISubscriptionService,
        
    ) {
        this.kafkaConnection = kafkaConnection
        this.subscriptionService = subscriptionService
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_sub_group`)
            await consumer.subscribe({ topic: 'sub-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ message }) => {
                    console.log("iam new sub consumer");
                    const data = message.value?.toString()
                    console.log(data);
                    console.log("iam new sub consumer");

                    if (data) {
                        const dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            this.subscriptionService.handleSubscriptionEvents(dataObj)
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