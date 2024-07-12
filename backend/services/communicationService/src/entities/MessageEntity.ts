import mongoose from "mongoose";

export default interface IMessage {
    message: string;
    sender: mongoose.Schema.Types.ObjectId;
    sender_name: string;
    group_id: string
    timestamp: Date;
}