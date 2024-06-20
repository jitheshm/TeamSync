
import UserRepository from "../../../repository/implementations/UserRepository";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import { generateOtp } from "../../../services/otpService";
import OtpRepository from "../../../repository/implementations/OtpRepository";
import OtpProducer from "../producers/OtpProducer";


export default class UserConsumer implements IConsumer {

    async consume() {
        try {
            let kafkaConnection = new KafkaConnection()
            let consumer = await kafkaConnection.getConsumerInstance('authservice_user_group')
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
                            case 'create':
                                await userRepository.create(dataObj.data)
                                let otp = generateOtp()
                                let otpRepository = new OtpRepository()
                                let otpObj = {
                                    email: dataObj.data.email,
                                    otp: `${otp}`,
                                    context: 'signup'
                                }
                                await otpRepository.create(otpObj, dataObj.data.email)


                                let producer = await kafkaConnection.getProducerInstance()
                                let otpProducer = new OtpProducer(producer, 'main', 'otps')
                                otpProducer.sendMessage('create', otpObj)
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