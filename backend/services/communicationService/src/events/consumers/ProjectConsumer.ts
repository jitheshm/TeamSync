import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import ProjectRepository from "../../repository/implementations/ProjectRepository";
import ChatRepository from "../../repository/implementations/ChatRepository";
import ProjectService from "../../services/implementations/ProjectService";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";
import { IProjectService } from "../../services/interfaces/IProjectService";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { inject, injectable } from "inversify";


@injectable()
export default class ProjectConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection;
    private projectService: IProjectService;

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IProjectService") projectService: IProjectService
    ) {
        this.kafkaConnection = kafkaConnection;
        this.projectService = projectService;
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
                            await this.projectService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
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
