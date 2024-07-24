import mongoose, { Schema } from "mongoose";

const chatNotificationSchema: Schema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },
    chat_id: { type: mongoose.Types.ObjectId, required: true },
    count: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false }

});

export default chatNotificationSchema;