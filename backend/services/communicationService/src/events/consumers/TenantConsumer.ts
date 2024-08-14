import { IConsumer, IKafkaConnection } from "teamsync-common";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import TenantRepository from "../../repository/implementations/TenantRepository";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantService from "../../services/implementations/TenantService";
import { ITenantService } from "../../services/interfaces/ITenantService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const tenantRepository:ITenantRepository = new TenantRepository();
const tenantService:ITenantService = new TenantService(tenantRepository);

export default class TenantConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`);
            await consumer.subscribe({ topic: "tenants-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new tenant event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await tenantService.handleEvent(dataObj.eventType, dataObj.data);
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
