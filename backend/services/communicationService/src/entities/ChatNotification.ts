import mongoose from "mongoose";

export default interface IChatNotfication{
   user_id: mongoose.Types.ObjectId;
    chat_id: mongoose.Types.ObjectId;
    count: number;
    is_deleted: boolean;
}