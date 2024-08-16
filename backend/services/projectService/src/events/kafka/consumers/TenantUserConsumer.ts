
import { inject, injectable } from "inversify";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import { ITenantUserService } from "../../../services/interfaces/ITenantUserService";
import { IConsumer } from "teamsync-common";

@injectable()
export default class TenantUserConsumer implements IConsumer {
    private tenantUserService: ITenantUserService;

    constructor(
        @inject("ITenantUserService") tenantUserService: ITenantUserService
    ) {
        this.tenantUserService = tenantUserService
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
