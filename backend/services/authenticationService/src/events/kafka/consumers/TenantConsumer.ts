
import { inject, injectable } from "inversify";
import { IConsumer, IKafkaConnection } from "teamsync-common";
import ITenantService from "../../../services/interfaces/ITenantService";


@injectable()
export default class TenantConsumer implements IConsumer {

    private kafkaConnection: IKafkaConnection
    private tenantService: ITenantService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITenantService") tenantService: ITenantService
    ) {
        this.kafkaConnection = kafkaConnection
        this.tenantService = tenantService
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`)
            await consumer.subscribe({ topic: 'tenants-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ message }) => {
                    console.log("iam new tenant consumer");
                    const data = message.value?.toString()
                    console.log(data);
                    console.log("iam new tenant consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            this.tenantService.handleTenantEvents(dataObj)
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