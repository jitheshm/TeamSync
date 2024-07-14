import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import TenantUserService from "../../../services/implementations/TenantUserService";
import ITenantUserService from "../../../services/interfaces/ITenantUserService";

export default class TenantUserConsumer implements IConsumer {
    private tenantUserService: ITenantUserService;

    constructor() {
        const tenantUserRepository = new TenantUserRepository();
        this.tenantUserService = new TenantUserService({ tenantUserRepository });
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`);
            await consumer.subscribe({ topic: 'tenant-user-events', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Tenant user consumer received a message.");
                    const data = message.value?.toString();
                    console.log(data);

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantUserService.handleTenantUserEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
                        }
                    }
                },
            });

            console.log("Subscribed to tenant-user-events topic.");
        } catch (error) {
            console.error("Error in consuming messages:", error);
        }
    }
}
