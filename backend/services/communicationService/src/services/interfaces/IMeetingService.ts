import mongoose, { Document } from "mongoose";
import IMeetingEnitity from "../../entities/MeetingEntity";

export interface IMeetingService {
    createMeeting(dbId: string, data: IMeetingEnitity): Promise<void>
    fetchMeetings(dbId: string, userId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (IMeetingEnitity & Document)[], totalCount: number }>
}
