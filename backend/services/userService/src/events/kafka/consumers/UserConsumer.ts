
import UserRepository from "../../../repository/implementations/UserRepository";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";



export default class UserConsumer implements IConsumer {

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance('userService_user_group')
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


                        switch (dataObj.eventType) {
                            case 'update':
                                await userRepository.updateUser(dataObj.data)
                                break;
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