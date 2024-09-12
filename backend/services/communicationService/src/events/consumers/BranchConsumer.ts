import { IConsumer, IKafkaConnection } from "teamsync-common";
import { IBranchService } from "../../services/interfaces/IBranchService";
import { inject, injectable } from "inversify";



@injectable()
export default class BranchConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection
    private branchService: IBranchService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IBranchService") branchService: IBranchService
    ) {
        this.kafkaConnection = kafkaConnection
        this.branchService = branchService
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
                            await this.branchService.handleEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
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
