import { Producer } from "kafkajs";
import IProducer from "../../../interfaces/IProducer";
import { IBranches } from "../../../entities/BranchEntity";


export default class BranchProducer implements IProducer<IBranches> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: IBranches) {
        try {
            await this.producer.send({
                topic: 'branch-events',
                messages: [
                    {
                        value: JSON.stringify({
                            dbName: this.dbName,
                            modelName: this.modelName,
                            eventType: eventType,
                            data: dataObj
                        }),
                        headers: { origin: process.env.SERVICE} 
                    }
                ]
            })
        } catch (error) {
            console.log('Error in branch Producer send method');
            throw error
        }
    }
}