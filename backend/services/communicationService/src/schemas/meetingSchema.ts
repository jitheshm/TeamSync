import mongoose, { Schema } from "mongoose";


const MeetingSchema = new mongoose.Schema({
    meetingTitle: {
        type: String,
        required: true,
        minlength: [3, 'Meeting title must be at least 3 characters long']
    },
    meetingDate: {
        type: Date,
        required: true
    },
    meetingTime: {
        type: String,
        required: true
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    scheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

export default MeetingSchema
