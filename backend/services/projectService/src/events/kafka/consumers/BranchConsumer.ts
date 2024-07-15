// src/events/kafka/consumers/BranchConsumer.ts

import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import BranchRepository from "../../../repository/implementations/BranchRepository";
import { BranchService } from "../../../services/implementations/BranchService";

const kafkaConnection = new KafkaConnection();

export default class BranchConsumer implements IConsumer {
    private branchService: BranchService;

    constructor() {
        const branchRepository = new BranchRepository();
        this.branchService = new BranchService(branchRepository);
    }

    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`);
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
