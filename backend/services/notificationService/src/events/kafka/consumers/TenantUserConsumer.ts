import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { ITenantUserService } from "../../../services/interfaces/ITenantUserService";


@injectable()
export default class TenantUserConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection;
    private tenantUserService: ITenantUserService;

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITenantUserService") tenantUserService: ITenantUserService
    ) {
        this.kafkaConnection = kafkaConnection;
        this.tenantUserService = tenantUserService
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`);
            await consumer.subscribe({ topic: "tenant-user-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new tenant user event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantUserService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
                        }
                    }
                },
            });

            console.log("Subscribed to new tenant users topic");
        } catch (error) {
            console.log(error);
        }
    }
}
