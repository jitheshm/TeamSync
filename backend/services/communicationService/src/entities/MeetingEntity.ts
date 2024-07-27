import mongoose from "mongoose";

export default interface IMeetingEnitity {
    meetingTitle: string;
    meetingDate: Date;
    meetingTime: string;
    meetingLink: string;
    participants: mongoose.Types.ObjectId[];
    scheduledBy: mongoose.Types.ObjectId;
}