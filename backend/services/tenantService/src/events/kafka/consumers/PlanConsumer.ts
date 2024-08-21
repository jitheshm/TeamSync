import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IPlanService } from "../../../services/interfaces/IPlanService";
import { IKafkaConnection } from "teamsync-common";




@injectable()
export default class PlanConsumer implements IConsumer {
    private planService: IPlanService
    private kafkaConnection:IKafkaConnection

    constructor(
        @inject("IPlanService") planService: IPlanService,
        @inject("IKafkaConnection") kafkaConnection:IKafkaConnection
    ) {
        this.planService = planService
        this.kafkaConnection=kafkaConnection
    }
    async consume() {
        try {
            let consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_plan_group`)
            await consumer.subscribe({ topic: 'plan-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new plan consumer");
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new plan consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {

                            this.planService.handleKafkaEvent(dataObj)
                        }

                    }
                },
            })
            console.log("subscribed to new plan topic");

        } catch (error) {
            console.log(error);

        }
    }

}