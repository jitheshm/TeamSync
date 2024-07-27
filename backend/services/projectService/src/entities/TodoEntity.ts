import mongoose, { Document, mongo } from "mongoose";

export interface ITodo {
    task: String;
    status: String;
    created_at: Date;
    user_id: mongoose.Types.ObjectId;
    is_deleted: Boolean;
}