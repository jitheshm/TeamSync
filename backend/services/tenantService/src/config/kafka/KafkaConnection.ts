import { Consumer, Kafka, Producer } from "kafkajs"
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import { injectable } from "inversify";

const kafkaInstance = new Kafka({
    clientId: process.env.SERVICE,
    brokers: [process.env.KAFKA_BROKER as string]

})

@injectable()
export class KafkaConnection implements IKafkaConnection {

    private static producer: Producer;
    private consumer?: Consumer

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
            if (!this.consumer) {
                this.consumer = kafkaInstance.consumer({ groupId: groupId })
                await this.consumer.connect()
            }
            return this.consumer
        } catch (error) {
            console.log(error);
            throw error

        }

    }
}