import { Schema } from 'mongoose';
import { IUsers } from '../entities/UserEntity';



const UsersSchema: Schema = new Schema<IUsers>({
    first_name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now },
    phone_no: { type: String },
    is_blocked: { type: Boolean, required: true, default: false },
    is_deleted: { type: Boolean, required: true, default: false },
    is_verified: { type: Boolean, required: true, default: false }
});

export default UsersSchema;