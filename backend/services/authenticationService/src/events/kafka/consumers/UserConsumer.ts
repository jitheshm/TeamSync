
import UserRepository from "../../../repository/implementations/UserRepository";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IUserConsumer from "../../../interfaces/IUserConsumer";


export default class UserConsumer implements IUserConsumer {

    async newUser() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance('authservice_new_user_group')
            consumer.subscribe({ topic: 'newUser' })
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
                        await userRepository.create(dataObj.data)
                    }
                },
            })
            console.log("subscribed to new user topic");
            
        } catch (error) {
            console.log(error);

        }
    }

}