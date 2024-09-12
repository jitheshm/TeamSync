import { Producer } from "kafkajs";
import { ITenantUsers } from "../../../entities/TenantUserEntity";
import { ITasks } from "../../../entities/TaskEntity";
import { IProducer } from "teamsync-common";


export default class TaskProducer implements IProducer<ITasks> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: ITasks) {
        try {
            await this.producer.send({
                topic: 'task-events',
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
            console.log('Error in task Producer send method');
            throw error
        }
    }
}