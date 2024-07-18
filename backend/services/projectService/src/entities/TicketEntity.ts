import mongoose, { Document, mongo } from "mongoose";

export interface ITickets extends Document {
    _id: mongoose.Types.ObjectId;
    ticket_id: String;
    title: String;
    description: String;
    upload_images: String[] | null;
    created_at: Date;
    project_id: mongoose.Types.ObjectId;
    status: String;
    tester_id: mongoose.Types.ObjectId;
    is_deleted: Boolean;
    task_id: mongoose.Types.ObjectId;
}