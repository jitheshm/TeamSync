import { Schema } from "mongoose";

const TicketSchma: Schema = new Schema({
    task_id: { type: Schema.Types.ObjectId, required: true },
    ticket_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    upload_images: [{ type: String, }],
    created_at: { type: Date, required: true,default: Date.now },
    project_id: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true, enum: ['pending', 'resolved', 'closed'],default: 'pending' },
    is_deleted: { type: Boolean, required: true,default: false },
});

export default TicketSchma;