import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import UserRepository from "../../repository/implementations/UserRepository";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import UserService from "../../services/implementations/UserService";
import { IUserService } from "../../services/interfaces/IUserService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const userRepository:IUserRepository = new UserRepository();
const userService:IUserService = new UserService(userRepository);

export default class UserConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_user_group`);
            await consumer.subscribe({ topic: "user-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new user event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await userService.handleEvent(dataObj.eventType, dataObj.data);
                        }
                    }
                },
            });

            console.log("Subscribed to new user topic");
        } catch (error) {
            console.log(error);
        }
    }
}
