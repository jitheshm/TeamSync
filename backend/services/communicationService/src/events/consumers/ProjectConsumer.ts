import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import ProjectRepository from "../../repository/implementations/ProjectRepository";
import ChatRepository from "../../repository/implementations/ChatRepository";
import ProjectService from "../../services/implementations/ProjectService";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { IProjectRepository } from "../../repository/interfaces/IProjectRepository";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";
import { IProjectService } from "../../services/interfaces/IProjectService";

const kafkaConnection: IKafkaConnection = new KafkaConnection();
const projectRepository: IProjectRepository = new ProjectRepository();
const chatRepository: IChatRepository = new ChatRepository();
const projectService: IProjectService = new ProjectService(projectRepository, chatRepository);

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
                            await projectService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
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
