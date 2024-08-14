import mongoose, { Document } from "mongoose";
import IMeetingEnitity from "../../entities/MeetingEntity";
import switchDb from "../../utils/switchDb";
import { IMeetingRepository } from "../interfaces/IMeetingRepository";
import { injectable } from "inversify";

@injectable()
export default class MeetingRepository implements IMeetingRepository {
    constructor() {
    }
    async createMeeting(dbId: string, meetingData: IMeetingEnitity): Promise<void> {
        try {
            const MeetingModel = switchDb<IMeetingEnitity>(`${process.env.SERVICE}_${dbId}`, 'meetings');
            const newMeeting = new MeetingModel(meetingData);
            await newMeeting.save();

        } catch (error) {
            throw error
        }
    }

    async fetchMeetings(dbId: string, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IMeetingEnitity & Document)[], totalCount: number }> {
        try {
            console.log(dbId, userId, search, page, limit);
            
            const MeetingModel = switchDb<IMeetingEnitity>(`${process.env.SERVICE}_${dbId}`, 'meetings');
            const query: any = {
                $or: [
                    { participants: userId },
                    { scheduledBy: userId }
                ]
            };
            if (search) {
                query.meetingTitle = { $regex: `^${search}`, $options: 'i' };
            }
            const data = await MeetingModel.find(query).skip((page - 1) * limit).limit(limit).sort({ meetingDate: -1 }).exec();
            const totalCount = await MeetingModel.countDocuments(query);

            console.log(data);

            return { data, totalCount };

        } catch (error) {
            throw error
        }

    }
}