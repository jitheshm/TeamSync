import mongoose, { Document } from "mongoose";
import IMeetingEnitity from "../../entities/MeetingEntity";

export interface IMeetingRepository {

    createMeeting(dbId: string, meetingData: IMeetingEnitity): Promise<void>
    fetchMeetings(dbId: string, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IMeetingEnitity & Document)[], totalCount: number }>
}