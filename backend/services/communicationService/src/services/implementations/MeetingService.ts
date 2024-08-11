import mongoose, { Document } from "mongoose";
import { IMeetingRepository } from "../../repository/interfaces/IMeetingRepository";
import IMeetingEnitity from "../../entities/MeetingEntity";
import { IMeetingService } from "../interfaces/IMeetingService";





export default class MeetingService implements IMeetingService {
    private meetingRepository: IMeetingRepository;

    constructor(meetingRepository: IMeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async createMeeting(dbId: string, data: IMeetingEnitity): Promise<void> {
        try {
            await this.meetingRepository.createMeeting(dbId, data);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create meeting");
        }
    }

    async fetchMeetings(dbId: string, userId: mongoose.Types.ObjectId,search:string|null,page:number,limit:number): Promise<{ data: (IMeetingEnitity & Document)[], totalCount: number }> {
        try {
            return await this.meetingRepository.fetchMeetings(dbId, userId,search,page,limit);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch meeting");
        }
    }
}
