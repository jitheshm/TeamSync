import { Producer } from "kafkajs";
import IProducer from "../../../interfaces/IProducer";
import ISubscriptions from "../../../entities/SubscriptionEntity";

export default class SubscriptionProducer implements IProducer<Partial<ISubscriptions>> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,subscription: Partial<ISubscriptions>) {
        try {
            await this.producer.send({
                topic: 'sub-events',
                messages: [
                    {
                        value: JSON.stringify({
                            dbName: this.dbName,
                            modelName: this.modelName,
                            eventType: eventType,
                            data: subscription
                        }),
                        headers: { origin: process.env.SERVICE}
                    }
                ]
            })
        } catch (error) {
            console.log('Error in subscription sendUser method');
            throw error
        }
    }
}