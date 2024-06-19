
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IOtpConsumer from "../../../interfaces/IOtpConsumer";
import { sendMail } from "../../../services/mailService";


export default class OtpConsumer implements IOtpConsumer {

    async newOtp() {
        let kafkaConnection = new KafkaConnection()
        let consumer = await kafkaConnection.getConsumerInstance('notification_otp_mail_group')
        consumer.subscribe({ topic: 'newOtp' })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new otp consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)

                        sendMail(dataObj.data.email, dataObj.data.email)
                    }
                } catch (error) {
                    console.log(error);

                }
            },
        })
    }
}