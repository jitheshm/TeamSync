import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../../repository/interfaces/ITenantUserRepository";
import TicketService from "../../../services/implementations/TicketService";
import { ITicketService } from "../../../services/interfaces/ITicketService";

const kafkaConnection:IKafkaConnection = new KafkaConnection();
const tenantUserRepository:ITenantUserRepository = new TenantUserRepository();
const ticketService:ITicketService = new TicketService(tenantUserRepository);

export default class TicketConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_ticket_group`);
            await consumer.subscribe({ topic: "ticket-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new ticket event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await ticketService.handleCreateTicketEvent(dataObj);
                        }
                    }
                },
            });

            console.log("Subscribed to new ticket topic");
        } catch (error) {
            console.log(error);
        }
    }
}
