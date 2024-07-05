import { ObjectId } from "mongoose";

export interface ITasks {
    _id: ObjectId;
    Task_id: String;
    Created_at: Date;
    Project_id: ObjectId;
    Project_manager_id: ObjectId;
    branch_id: ObjectId;
    Title: String;
    Developer_id: ObjectId;
    Description: String;
    Due_date: Date;
    Status: String;
    Is_deleted: Boolean;
}