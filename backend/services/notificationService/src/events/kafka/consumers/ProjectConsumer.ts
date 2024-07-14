import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import ProjectService from "../../../services/implementations/ProjectService";

const kafkaConnection = new KafkaConnection();
const tenantUserRepository = new TenantUserRepository();
const projectService = new ProjectService(tenantUserRepository);

export default class ProjectConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_project_group`);
            await consumer.subscribe({ topic: "project-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new project event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await projectService.handleCreateProjectEvent(dataObj);
                        }
                    }
                },
            });

            console.log("Subscribed to new project topic");
        } catch (error) {
            console.log(error);
        }
    }
}
