import mongoose, { ObjectId } from "mongoose";

export interface ITasks {
    _id: mongoose.Types.ObjectId;
    task_id: String;
    created_at: Date;
    project_id: mongoose.Types.ObjectId;
    branch_id: mongoose.Types.ObjectId;
    title: String;
    developer_id: mongoose.Types.ObjectId;
    tester_id: mongoose.Types.ObjectId;
    description: String;
    due_date: Date;
    status: String;
    is_deleted: Boolean;
}