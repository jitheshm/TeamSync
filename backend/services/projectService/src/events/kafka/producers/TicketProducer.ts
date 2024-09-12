import { Producer } from "kafkajs";
import { ITenantUsers } from "../../../entities/TenantUserEntity";
import { ITickets } from "../../../entities/TicketEntity";
import mongoose from "mongoose";
import { IProducer } from "teamsync-common";


export default class TicketProducer implements IProducer<{ newTicket: ITickets, developer_id: mongoose.Types.ObjectId }> {
    private producer: Producer;
    private dbName: string;
    private modelName: string;


    constructor(producer: Producer, dbName: string, modelName: string) {
        this.producer = producer;
        this.dbName = dbName;
        this.modelName = modelName;
    }


    async sendMessage(eventType: string, dataObj: { newTicket: ITickets, developer_id: mongoose.Types.ObjectId }): Promise<void> {
        try {
            await this.producer.send({
                topic: 'ticket-events',
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
            console.log('Error in ticket Producer send method');
            throw error
        }
    }
}