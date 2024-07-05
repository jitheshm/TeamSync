import { ObjectId } from "mongoose";

export interface IBranches {
    _id: ObjectId;
    branch_id: string;
    location: string;
    is_deleted: boolean;
}