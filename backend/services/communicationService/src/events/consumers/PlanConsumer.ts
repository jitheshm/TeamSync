import { IConsumer } from "teamsync-common";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import PlanRepository from "../../repository/implementations/PlanRepository";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import PlanService from "../../services/implementations/PlanService";
import { IPlanService } from "../../services/interfaces/IPlanService";

const planRepository:IPlanRepository = new PlanRepository();
const planService:IPlanService = new PlanService(planRepository);

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
