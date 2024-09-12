
import { inject, injectable } from "inversify";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantRepository from "../../../repository/implementations/TenantRepository";
import { ITenantService } from "../../../services/interfaces/ITenantService";


@injectable()
export default class TenantConsumer implements IConsumer {
    private tenantService: ITenantService
    constructor(
        @inject("ITenantService") tenantService: ITenantService
    ) {
        this.tenantService = tenantService
    }

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
                            this.tenantService.handleKafkaEvent(dataObj.eventType, dataObj.data)

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