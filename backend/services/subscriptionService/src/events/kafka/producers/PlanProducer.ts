import { Producer } from "kafkajs";
import IProducer from "../../../interfaces/IProducer";
import IPlan from "../../../entities/PlanEntity";

export default class PlanProducer implements IProducer<Partial<IPlan>> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,subscription: Partial<IPlan>) {
        try {
            await this.producer.send({
                topic: 'plan-events',
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
            console.log('Error in plan sendUser method');
            throw error
        }
    }
}