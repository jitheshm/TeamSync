import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { IProjectService } from "../../../services/interfaces/IProjectService";



@injectable()
export default class ProjectConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection
    private projectService: IProjectService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IProjectService") projectService: IProjectService
    ) {
        this.kafkaConnection = kafkaConnection
        this.projectService = projectService
    }
    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_project_group`);
            await consumer.subscribe({ topic: "project-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new project event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.projectService.handleCreateProjectEvent(dataObj);
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
