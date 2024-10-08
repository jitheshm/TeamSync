import { Producer } from "kafkajs";
import { IOtp } from "../../../entities/OtpEntity";
import { IProducer } from "teamsync-common";

export default class OtpProducer implements IProducer<IOtp> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;

    
    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string,dataObj: IOtp) {
        try {
            await this.producer.send({
                topic: 'otp-events',
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
            console.log('Error in OtpProducer send method');
            throw error
        }
    }
}