import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import PlanRepository from "../../repository/implementations/PlanRepository";




export default class PlanConsumer implements IConsumer {

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_plan_group`)
            await consumer.subscribe({ topic: 'plan-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new plan consumer");
                    let planRepository = new PlanRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new plan consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':
                                    await planRepository.create(dataObj.data)
                                    break;
                                case 'update':
                                    await planRepository.update(dataObj.data,dataObj.data._id)
                                    break;
                            }
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