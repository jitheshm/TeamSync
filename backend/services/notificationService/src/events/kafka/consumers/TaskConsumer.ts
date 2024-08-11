import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../../repository/interfaces/ITenantUserRepository";
import TaskService from "../../../services/implementations/TaskService";
import { ITaskService } from "../../../services/interfaces/ITaskService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const tenantUserRepository:ITenantUserRepository = new TenantUserRepository();
const taskService:ITaskService = new TaskService(tenantUserRepository);

export default class TaskConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_task_group`);
            await consumer.subscribe({ topic: "task-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new task event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await taskService.handleCreateTaskEvent(dataObj);
                        }
                    }
                },
            });

            console.log("Subscribed to new task topic");
        } catch (error) {
            console.log(error);
        }
    }
}
