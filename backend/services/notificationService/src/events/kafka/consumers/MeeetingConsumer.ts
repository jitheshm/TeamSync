import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import MeetingService from "../../../services/implementations/MeetingService";

const kafkaConnection = new KafkaConnection();
const tenantUserRepository = new TenantUserRepository();
const meetingService = new MeetingService(tenantUserRepository);

export default class MeetingConsumer implements IConsumer {
    async consume() {
        try {
            const consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_meeting_group`);
            await consumer.subscribe({ topic: "meeting-events", fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("Received new meeting event");
                    const data = message.value?.toString();

                    if (data) {
                        const dataObj = JSON.parse(data);
                        const origin = message.headers?.origin?.toString();

                        if (origin !== process.env.SERVICE) {
                            await meetingService.handleCreateMeetingEvent(dataObj);
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
