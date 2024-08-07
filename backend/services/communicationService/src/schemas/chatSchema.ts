import mongoose, { Schema } from "mongoose";

const ChatSchema: Schema = new Schema({
    name: { type: String, required: false },
    group_id: { type: String, required: true },
    type: { type: String, required: true, enum: ['personal', 'group'] },
    members: [{ type: mongoose.Schema.Types.ObjectId }],
});

export default ChatSchema;