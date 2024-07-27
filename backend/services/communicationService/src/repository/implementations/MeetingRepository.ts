import { Document } from "mongoose";
import IMeetingEnitity from "../../entities/MeetingEntity";
import switchDb from "../../utils/switchDb";
import { IMeetingRepository } from "../interfaces/IMeetingRepository";


export default class MeetingRepository implements IMeetingRepository {
    constructor() {
    }
    async createMeeting(dbId: string, meetingData: IMeetingEnitity): Promise<void> {
        try {
            const MeetingModel = switchDb(`${process.env.SERVICE}_${dbId}`, 'meetings');
            const newMeeting = new MeetingModel(meetingData);
            await newMeeting.save();

        } catch (error) {
            throw error
        }
    }

}