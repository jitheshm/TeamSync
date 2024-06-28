import { Producer } from "kafkajs";
import { ITenants } from "../../../entities/TenantEntity";
import IProducer from "../../../interfaces/IProducer";


export default class TenantProducer implements IProducer<ITenants> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: ITenants) {
        try {
            await this.producer.send({
                topic: 'tenants-events',
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
            console.log('Error in tenant Producer send method');
            throw error
        }
    }
}