import { IConsumer } from "teamsync-common";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import { IPlanService } from "../../services/interfaces/IPlanService";
import { inject, injectable } from "inversify";


@injectable()
export default class PlanConsumer implements IConsumer {
    private kafkaConnection: KafkaConnection;
    private planService: IPlanService;

    constructor(
        @inject("KafkaConnection") kafkaConnection: KafkaConnection,
        @inject("IPlanService") planService: IPlanService
    ) {
        this.kafkaConnection = kafkaConnection;
        this.planService = planService;
    }

    

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_plan_group`);
            await consumer.subscribe({ topic: "plan-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new plan event");
                    const planData = message.value?.toString();

                    if (planData) {
                        const dataObj = JSON.parse(planData);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.planService.handleEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });

            console.log("Subscribed to new plan topic");
        } catch (error) {
            console.log(error);
        }
    }
}
