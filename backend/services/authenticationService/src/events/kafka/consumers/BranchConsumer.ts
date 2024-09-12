import { inject, injectable } from "inversify";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import IBranchService from "../../../services/interfaces/IBranchService";


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

            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`)
            await consumer.subscribe({ topic: 'branch-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({  message }) => {
                    console.log("iam new branch consumer");
                    const data = message.value?.toString()
                    console.log(data);
                    console.log("iam new branch consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();
                        if (origin != process.env.SERVICE) {
                            this.branchService.handleBranchEvents(dataObj)
                        }

                    }
                },
            })
            console.log("subscribed to new branch topic");

        } catch (error) {
            console.log(error);

        }
    }

}