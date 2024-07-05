import { Schema } from "mongoose";

const TasksSchema: Schema = new Schema({
    task_id: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true,default:Date.now },
    project_id: { type: Schema.Types.ObjectId, required: true },
    branch_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    developer_id: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    due_date: { type: Date, required: true },
    status: { type: String, required: true ,default:"pending"},
    is_deleted: { type: Boolean, required: true ,default:false},
  });

  export default TasksSchema 