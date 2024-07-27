import { Document } from "mongoose";
import IMeetingEnitity from "../../entities/MeetingEntity";

export interface IMeetingRepository {

    createMeeting(dbId: string, meetingData: IMeetingEnitity): Promise<void>
}