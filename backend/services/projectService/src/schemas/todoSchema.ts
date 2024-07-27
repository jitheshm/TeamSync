import { Schema } from "mongoose";

const TodoSchema: Schema = new Schema({
    task: { type: String, required: true },
    status: { type: String, required: true, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
    created_at: { type: Date, required: true, default: Date.now },
    user_id: { type: Schema.Types.ObjectId, required: true },
    is_deleted: { type: Boolean, required: true, default: false }

});

export default TodoSchema;