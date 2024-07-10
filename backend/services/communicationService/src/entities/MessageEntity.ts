import mongoose from "mongoose";

export default interface IMessage {
    message: string;
    sender: mongoose.Schema.Types.ObjectId;
    chat_id: mongoose.Schema.Types.ObjectId;
    timestamp: Date;
}