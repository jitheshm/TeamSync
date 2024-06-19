import { generateOtp } from "../../../services/otpService";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IOtpConsumer from "../../../interfaces/IOtpConsumer";
import OtpRepository from "../../../repository/implementations/OtpRepository";
import OtpProducer from "../producers/OtpProducer";

export default class OtpConsumer implements IOtpConsumer {

    async newOtp() {
        let kafkaConnection = new KafkaConnection()
        let consumer = await kafkaConnection.getConsumerInstance('authservice_otp_receive_group')
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
                            otp: `${otp}`,
                            context: 'signup'
                        }
                        await otpRepository.create(otpObj, dataObj.data.email)


                        let producer = await kafkaConnection.getProducerInstance()
                        let otpProducer = new OtpProducer(producer, 'main', 'otps')
                        otpProducer.sendMessage('create', otpObj)

                    }
                } catch (error) {
                    console.log(error);

                }
            },
        })
    }
}