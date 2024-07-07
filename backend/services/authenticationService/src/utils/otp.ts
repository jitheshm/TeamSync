import { KafkaConnection } from "../config/kafka/KafkaConnection";
import OtpProducer from "../events/kafka/producers/OtpProducer";
import { IKafkaConnection } from "../interfaces/IKafkaConnection";
import OtpRepository from "../repository/implementations/OtpRepository";
import { IOtpRepository } from "../repository/interface/IOtpRepository";

const otpRepository: IOtpRepository = new OtpRepository()
const kafkaConnection: IKafkaConnection = new KafkaConnection()

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}


export const sendOtp = async (email: string, context: string)=>{
    try {

        const otp = generateOtp()
        const otpObj = {
            email: email,
            otp: `${otp}`,
            context: context
        }
        await otpRepository.create(otpObj, email)


        let producer = await kafkaConnection.getProducerInstance()
        let otpProducer = new OtpProducer(producer, 'main', 'otps')
        otpProducer.sendMessage('create', otpObj)

    } catch (error) {
        console.log(error);
        throw error
    }
}
