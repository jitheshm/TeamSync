import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export interface ITenantUsers {
    _id: mongoose.Types.ObjectId;
    email: String;
    created_at: Date;
    name: String;
    tenant_user_id: String;
    role: String;
    is_deleted: Boolean;
    branch_id: ObjectId;
    phone_no: String;
    image: String | null;
}