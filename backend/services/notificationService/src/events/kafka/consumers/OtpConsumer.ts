
import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { sendMail } from "../../../utils/mailService";

@injectable()
export default class OtpConsumer implements IConsumer {

    private kafkaConnection: IKafkaConnection
    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection
    ) {
        this.kafkaConnection = kafkaConnection
    }

    async consume() {
        let consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_otp_mail_group`)
        await consumer.subscribe({ topic: 'otp-events', fromBeginning: true })
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