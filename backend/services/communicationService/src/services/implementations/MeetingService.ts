import mongoose, { Document } from "mongoose";
import { IMeetingRepository } from "../../repository/interfaces/IMeetingRepository";
import IMeetingEnitity from "../../entities/MeetingEntity";
import { IMeetingService } from "../interfaces/IMeetingService";
import { inject, injectable } from "inversify";
import MeetingProducer from "../../events/producers/MeetingProducer";
import { IKafkaConnection } from "teamsync-common";




@injectable()
export default class MeetingService implements IMeetingService {
    private meetingRepository: IMeetingRepository;
    private kafkaConnection: IKafkaConnection

    constructor(
        @inject("IMeetingRepository") meetingRepository: IMeetingRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection) {
        this.meetingRepository = meetingRepository;
        this.kafkaConnection = kafkaConnection;
    }

    async createMeeting(dbId: string, data: IMeetingEnitity): Promise<void> {
        await this.meetingRepository.createMeeting(dbId, data);
        const tenantId = dbId
        const producer = await this.kafkaConnection?.getProducerInstance();
        const tenantMeetingProducer = new MeetingProducer(producer!, tenantId, 'meetings');
        tenantMeetingProducer.sendMessage('create', data);

    }

    async fetchMeetings(dbId: string, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IMeetingEnitity & Document)[], totalCount: number }> {
        try {
            return await this.meetingRepository.fetchMeetings(dbId, userId, search, page, limit);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch meeting");
        }
    }
}
