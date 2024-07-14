import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import PlanRepository from "../../repository/implementations/PlanRepository";
import PlanService from "../../services/implementations/PlanService";

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);

export default class PlanConsumer implements IConsumer {
    private kafkaConnection: KafkaConnection;

    constructor() {
        this.kafkaConnection = new KafkaConnection();
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
                            await planService.handleEvent(dataObj.eventType, dataObj.data);
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
