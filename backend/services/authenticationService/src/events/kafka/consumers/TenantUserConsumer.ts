
import { IConsumer, IKafkaConnection } from "teamsync-common";
import { IUserService } from "../../../services/interfaces/IUserService";
import { inject, injectable } from "inversify";



@injectable()
export default class TenantUserConsumer implements IConsumer {

    private kafkaConnection: IKafkaConnection
    private userService: IUserService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IUserService") userService: IUserService
    ) {
        this.kafkaConnection = kafkaConnection
        this.userService = userService
    }

    async consume() {
        try {

            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_users_group`)
            await consumer.subscribe({ topic: 'tenant-user-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ message }) => {
                    console.log("iam new tenant_users consumer");
                    const data = message.value?.toString()
                    console.log(data);
                    console.log("iam new tenant_users consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        const dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            this.userService.handleTenantUserEvents(dataObj)
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