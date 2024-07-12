import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    sender_name: { type: String, required: true },
    group_id: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default messageSchema;