import { Producer } from "kafkajs";
import IProducer from "../../interfaces/IProducer";
import IMeetingEnitity from "../../entities/MeetingEntity";



export default class MeetingProducer implements IProducer<IMeetingEnitity> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;


    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string, dataObj: IMeetingEnitity) {
        try {
            await this.producer.send({
                topic: 'meeting-events',
                messages: [
                    {
                        value: JSON.stringify({
                            dbName: this.dbName,
                            modelName: this.modelName,
                            eventType: eventType,
                            data: dataObj
                        }),
                        headers: { origin: process.env.SERVICE }
                    }
                ]
            })
        } catch (error) {
            console.log('Error in meeting Producer send method');
            throw error
        }
    }
}