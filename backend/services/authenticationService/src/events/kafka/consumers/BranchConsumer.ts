import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import BranchRepository from "../../../repository/implementations/BranchRepository";
import BranchService from "../../../services/implementations/BranchService";
import { IBranchService } from "../../../services/interfaces/IBranchService";


export default class BranchConsumer implements IConsumer {
    private branchService: IBranchService;

    constructor() {
        const branchRepository = new BranchRepository();
        this.branchService = new BranchService(branchRepository);
    }

    async consume() {
        try {
            const kafkaConnection = new KafkaConnection();
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`);
            await consumer.subscribe({ topic: 'branch-events', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Branch consumer received a message.");
                    const data = message.value?.toString();
                    console.log(data);

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.branchService.handleBranchEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
                        }
                    }
                },
            });

            console.log("Subscribed to branch-events topic.");
        } catch (error) {
            console.error("Error in consuming messages:", error);
        }
    }
}
