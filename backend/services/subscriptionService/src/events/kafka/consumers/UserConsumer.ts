
import UserRepository from "../../../repository/implementations/UserRepository";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import { inject, injectable } from "inversify";
import { IUserService } from "../../../services/interfaces/IUserService";



@injectable()
export default class UserConsumer implements IConsumer {
    private userService: IUserService

    constructor(
        @inject("IUserService") userService: IUserService
    ) {
        this.userService = userService
    }

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_user_group`)
            await consumer.subscribe({ topic: 'user-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new user consumer");
                    let userRepository = new UserRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new user consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            this.userService.handleKafkaEvent(dataObj.eventType, dataObj.data)
                        }

                    }
                },
            })
            console.log("subscribed to new user topic");

        } catch (error) {
            console.log(error);

        }
    }

}