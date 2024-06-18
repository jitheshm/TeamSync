import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IOtpConsumer from "../../../interfaces/IOtpConsumer";

export default class OtpConsumer implements IOtpConsumer{

    async signupOtp() {
        let kafkaConnection = new KafkaConnection()
        let consumer = await kafkaConnection.getConsumerInstance('signup_otp_send_group')
        consumer.subscribe({ topic: 'newUser' })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("iam signup otp consumer");

                console.log({
                    value: message.value?.toString(),
                })
            },
        })
    }
}