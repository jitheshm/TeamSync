import { Producer } from "kafkajs";
import IProducer from "../../../interfaces/IProducer";
import { ITenantUsers } from "../../../entities/TenantUserEntity";
import { IProjects } from "../../../entities/ProjectEntity";


export default class ProjectProducer implements IProducer<IProjects> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: IProjects) {
        try {
            await this.producer.send({
                topic: 'project-events',
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
            console.log('Error in prject Producer send method');
            throw error
        }
    }
}