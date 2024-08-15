import { inject, injectable } from "inversify";
import IConsumer from "../../../interfaces/IConsumer";
import { IKafkaConnection } from "../../../interfaces/IKafkaConnection";
import { IMeetingService } from "../../../services/interfaces/IMeetingService";



@injectable()
export default class MeetingConsumer implements IConsumer {
    private meetingService: IMeetingService;
    private kafkaConnection: IKafkaConnection;
    constructor(
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IMeetingService") meetingService: IMeetingService
    ) {
        this.kafkaConnection = kafkaConnection;
        this.meetingService = meetingService;
    }
    async consume() {
        try {
            const consumer = await this.kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_meeting_group`);
            await consumer.subscribe({ topic: "meeting-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new meeting event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await this.meetingService.handleCreateMeetingEvent(dataObj);
                        }
                    }
                },
            });

            console.log("Subscribed to new meetng topic");
        } catch (error) {
            console.log(error);
        }
    }
}
