import { Schema } from "mongoose";


const TenantUserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tenant_user_id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    branch_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    phone_no: { type: String, required: true },
    image: { type: String },
    is_deleted: { type: Boolean, required: true,default:false },
    created_at: { type: Date, required: true, default: Date.now() },
});


export default TenantUserSchema;