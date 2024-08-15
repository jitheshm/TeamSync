import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { ITicketService } from "../../../services/interfaces/ITicketService";

@injectable()
export default class TicketConsumer implements IConsumer {
    private kafkaConnection: IKafkaConnection;
    private ticketService: ITicketService

    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITicketService") ticketService: ITicketService
    ) {
        this.kafkaConnection = kafkaConnection
        this.ticketService = ticketService
    }

    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_ticket_group`);
            await consumer.subscribe({ topic: "ticket-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new ticket event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.ticketService.handleCreateTicketEvent(dataObj);
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
