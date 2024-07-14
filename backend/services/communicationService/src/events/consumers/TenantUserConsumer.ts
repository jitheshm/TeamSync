import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import TenantUserRepository from "../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";
import TenantUserService from "../../services/implementations/TenantUserService";
import { ITenantUserService } from "../../services/interfaces/ITenantUserService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const tenantUserRepository:ITenantUserRepository = new TenantUserRepository();
const tenantUserService:ITenantUserService = new TenantUserService(tenantUserRepository);

export default class TenantUserConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`);
            await consumer.subscribe({ topic: "tenant-user-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new tenant user event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await tenantUserService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
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
