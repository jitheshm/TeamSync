import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export interface ITenantUsers {
    _id: mongoose.Types.ObjectId;
    email: string;
    created_at: Date;
    name: string;
    tenant_user_id: string;
    role: string;
    is_deleted: boolean;
    branch_id: ObjectId;
    phone_no: string;
    image: string | null;
}