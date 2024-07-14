import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantRepository from "../../../repository/implementations/TenantRepository";
import TenantService from "../../../services/implementations/TenantService";
import { ITenantService } from "../../../services/interfaces/ITenantService";

export default class TenantConsumer implements IConsumer {
    private tenantService: ITenantService;

    constructor() {
        const tenantRepository = new TenantRepository();
        this.tenantService = new TenantService(tenantRepository);
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`);
            await consumer.subscribe({ topic: 'tenants-events', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Tenant consumer received a message.");
                    const data = message.value?.toString();
                    console.log(data);

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantService.handleTenantEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });

            console.log("Subscribed to tenants-events topic.");
        } catch (error) {
            console.error("Error in consuming messages:", error);
        }
    }
}
