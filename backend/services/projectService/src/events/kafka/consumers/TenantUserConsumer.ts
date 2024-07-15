
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import TenantUserService from "../../../services/implementations/TenantUserService";

export default class TenantUserConsumer implements IConsumer {
    private tenantUserService: TenantUserService;

    constructor() {
        const tenantUserRepository = new TenantUserRepository();
        this.tenantUserService = new TenantUserService({tenantUserRepository});
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`);
            await consumer.subscribe({ topic: 'tenant-user-events', fromBeginning: true });
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("I am a new tenant_users consumer");
                    const data = message.value?.toString();
                    console.log(data);
                    console.log("I am a new tenant_users consumer >>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantUserService.handleKafkaEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
                        }
                    }
                },
            });
            console.log("Subscribed to new tenant_users topic");

        } catch (error) {
            console.log(error);
        }
    }
}
