import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { ITaskService } from "../../../services/interfaces/ITaskService";


@injectable()
export default class TaskConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection
    private taskService: ITaskService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITaskService") taskService: ITaskService
    ) {
        this.kafkaConnection = kafkaConnection
        this.taskService = taskService
    }
    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_task_group`);
            await consumer.subscribe({ topic: "task-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new task event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.taskService.handleCreateTaskEvent(dataObj);
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
