import { Consumer, Kafka, Producer } from "kafkajs"
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";

const kafkaInstance = new Kafka({
    brokers: ["redpanda-0:9092"]

})

export class KafkaConnection implements IKafkaConnection {

    private static producer: Producer;
    private static consumer: Consumer

    // constructor(){}

    async getProducerInstance() {
        try {

            if (!KafkaConnection.producer) {
                KafkaConnection.producer = kafkaInstance.producer()
                await KafkaConnection.producer.connect()
                console.log('Producer connected');
                
            }
            return KafkaConnection.producer

        } catch (error) {
            console.log('Error in KafkaConnection getProducerInstance method');
            
            console.log(error);
            throw error

        }
    }

    async getConsumerInstance(groupId: string) {
        try {
            if (!KafkaConnection.consumer) {
                KafkaConnection.consumer = kafkaInstance.consumer({ groupId: groupId })
                await KafkaConnection.consumer.connect()
            }
            return KafkaConnection.consumer
        } catch (error) {
            console.log(error);
            throw error

        }

    }
}