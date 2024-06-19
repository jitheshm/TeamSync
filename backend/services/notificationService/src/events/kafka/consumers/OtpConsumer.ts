import { generateOtp } from "../../../services/otpService";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IOtpConsumer from "../../../interfaces/IOtpConsumer";
import { sendMail } from "../../../services/mailService";
import OtpRepository from "../../../repository/implementations/OtpRepository";
import OtpProducer from "../producers/OtpProducer";

export default class OtpConsumer implements IOtpConsumer {

    async signupOtp() {
        let kafkaConnection = new KafkaConnection()
        let consumer = await kafkaConnection.getConsumerInstance('otp_send_group')
        consumer.subscribe({ topic: 'newUser' })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new user consumer");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        let otp = generateOtp()
                        let otpRepository = new OtpRepository()
                        let otpObj = {
                            email: dataObj.data.email,
                            otp: `${otp}`
                        }
                        await otpRepository.create(otpObj, dataObj.data.email)


                        let producer = await kafkaConnection.getProducerInstance()
                        let userProducer = new OtpProducer(producer, 'main', 'otps')
                        userProducer.sendMessage('create', otpObj)

                        sendMail(dataObj.data.email, otp)
                    }
                } catch (error) {
                    console.log(error);

                }
            },
        })
    }
}