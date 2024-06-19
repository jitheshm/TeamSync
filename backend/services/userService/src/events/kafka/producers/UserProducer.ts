import { Producer } from "kafkajs";
import { IUsers } from "../../../entities/UserEntity";
import IProducer from "../../../interfaces/IProducer";

export default class UserProducer implements IProducer<IUsers> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,user: IUsers) {
        try {
            await this.producer.send({
                topic: 'user-events',
                messages: [
                    {
                        value: JSON.stringify({
                            dbName: this.dbName,
                            modelName: this.modelName,
                            eventType: eventType,
                            data: user
                        })
                    }
                ]
            })
        } catch (error) {
            console.log('Error in UserProducer sendUser method');
            throw error
        }
    }
}