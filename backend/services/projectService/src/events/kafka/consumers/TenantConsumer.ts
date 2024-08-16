// src/events/kafka/consumers/TenantConsumer.ts

import { IConsumer } from "teamsync-common";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import { ITenantService } from "../../../services/interfaces/ITenantService";
import { inject, injectable } from "inversify";

@injectable()
export default class TenantConsumer implements IConsumer {
    private tenantService: ITenantService;

    constructor(
        @inject("ITenantService") tenantService: ITenantService
    ) {
        this.tenantService = tenantService
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`);
            await consumer.subscribe({ topic: 'tenants-events', fromBeginning: true });
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("I am a new tenant consumer");
                    const data = message.value?.toString();
                    console.log(data);
                    console.log("I am a new tenant consumer >>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantService.handleKafkaEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });
            console.log("Subscribed to new tenant topic");

        } catch (error) {
            console.log(error);
        }
    }
}
