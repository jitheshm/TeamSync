import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import BranchRepository from "../../../repository/implementations/BranchRepository";
import { IBranchRepository } from "../../../repository/interfaces/IBranchRepository";
import BranchService from "../../../services/implementations/BranchService";
import { IBranchService } from "../../../services/interfaces/IBranchService";


const branchRepository: IBranchRepository = new BranchRepository();
const branchService: IBranchService = new BranchService(branchRepository);

export default class BranchConsumer implements IConsumer {
    private kafkaConnection: KafkaConnection;

    constructor() {
        this.kafkaConnection = new KafkaConnection();
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`);
            await consumer.subscribe({ topic: "branch-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new branch event");
                    const branchData = message.value?.toString();

                    if (branchData) {
                        const dataObj = JSON.parse(branchData);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await branchService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
                        }
                    }
                },
            });

            console.log("Subscribed to new branch topic");
        } catch (error) {
            console.log(error);
        }
    }
}
