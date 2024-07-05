
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";


let kafkaConnection = new KafkaConnection()

export default class TenantUserConsumer implements IConsumer {

    async consume() {
        try {

            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`)
            await consumer.subscribe({ topic: 'tenant-user-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new tenant_users consumer");
                    let tenantUserRepository = new TenantUserRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new tenant_users consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':

                                    await tenantUserRepository.create(dataObj.data, dataObj.dbName)
                                    break;
                                case 'update':

                                    await tenantUserRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                                    break;


                            }
                        }

                    }
                },
            })
            console.log("subscribed to new tenant_users topic");

        } catch (error) {
            console.log(error);

        }
    }

}