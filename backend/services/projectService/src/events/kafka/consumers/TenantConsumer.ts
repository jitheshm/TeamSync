
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantRepository from "../../../repository/implementation/TenantRepository";



export default class TenantConsumer implements IConsumer {

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`)
            await consumer.subscribe({ topic: 'tenants-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new tenant consumer");
                    let tenantRepository = new TenantRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new tenant consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':

                                    await tenantRepository.create(dataObj.data)
                                    break;
                                
                            }
                        }

                    }
                },
            })
            console.log("subscribed to new tenant topic");

        } catch (error) {
            console.log(error);

        }
    }

}