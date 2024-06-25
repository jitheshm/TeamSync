import { ObjectId } from 'mongoose';

export interface IUsers {
    _id: ObjectId;
    first_name: string;
    user_id: string;
    last_name: string;
    password: string;
    email: string;
    authentication_id: string;
    authentication_provider: string;
    stripe_customer_id: string;
    created_at: Date;
    phone_no: string | null;
    is_blocked: boolean;
    is_deleted: boolean;
    is_verified: boolean;
}
