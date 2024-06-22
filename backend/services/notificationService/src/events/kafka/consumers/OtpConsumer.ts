
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { sendMail } from "../../../services/mailService";

const kafkaConnection:IKafkaConnection = new KafkaConnection()

export default class OtpConsumer implements IConsumer {

    async consume() {
        let consumer = await kafkaConnection.getConsumerInstance('notification_otp_mail_group')
        await consumer.subscribe({ topic: 'otp-events' ,fromBeginning: true})
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new otp consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)

                        sendMail(dataObj.data.email, dataObj.data.otp)
                    }
                } catch (error) {
                    console.log(error);

                }
            },
        })
    }
}