import mongoose, { ObjectId } from "mongoose";

export interface IProjects {
    _id: ObjectId;
    name: String;
    project_id: String;
    description: String;
    developers_id: mongoose.Types.ObjectId[];
    stage: String;
    project_manager_id: mongoose.Types.ObjectId;
    end_date: Date;
    start_date: Date;
    created_at: Date;
    branch_id: mongoose.Types.ObjectId;
    client_name: String;
    tester_id: mongoose.Types.ObjectId;
    is_deleted: Boolean;
}