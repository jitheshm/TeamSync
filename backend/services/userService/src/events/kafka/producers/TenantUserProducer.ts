import { Producer } from "kafkajs";
import IProducer from "../../../interfaces/IProducer";
import { ITenantUsers } from "../../../entities/TenantUserEntity";


export default class TenantUserProducer implements IProducer<ITenantUsers> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: ITenantUsers) {
        try {
            await this.producer.send({
                topic: 'tenant-user-events',
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
            console.log('Error in tenant user Producer send method');
            throw error
        }
    }
}