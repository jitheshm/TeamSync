
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { inject, injectable } from "inversify";
import { IBranchService } from "../../../services/interfaces/IBranchService";

@injectable()
export default class BranchConsumer implements IConsumer {
    private branchService: IBranchService;
    private kafkaConnection: IKafkaConnection

    constructor(
        @inject("IBranchService") branchService: IBranchService,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection
    ) {
        this.branchService = branchService
        this.kafkaConnection = kafkaConnection
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`);
            await consumer.subscribe({ topic: 'branch-events', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("I am a new branch consumer");
                    const data = message.value?.toString();
                    console.log(data);
                    console.log("I am a new branch consumer >>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data);
                        console.log(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.branchService.handleKafkaEvent(dataObj.eventType, dataObj.data, dataObj.dbName);
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
