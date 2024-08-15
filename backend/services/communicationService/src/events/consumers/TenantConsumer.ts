import { IConsumer, IKafkaConnection } from "teamsync-common";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantService from "../../services/implementations/TenantService";
import { ITenantService } from "../../services/interfaces/ITenantService";
import { inject, injectable } from "inversify";


@injectable()
export default class TenantConsumer implements IConsumer {
    private tenantRepository: ITenantRepository;
    private tenantService: ITenantService;
    private kafkaConnection: IKafkaConnection;

    constructor(
        @inject("ITenantRepository") tenantRepository: ITenantRepository,
        @inject("ITenantService") tenantService: ITenantService,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection
    ) {
        this.tenantRepository = tenantRepository;
        this.tenantService = tenantService;
        this.kafkaConnection = kafkaConnection;
    }


    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenants_group`);
            await consumer.subscribe({ topic: "tenants-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new tenant event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.tenantService.handleEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });

            console.log("Subscribed to new tenant topic");
        } catch (error) {
            console.log(error);
        }
    }
}
