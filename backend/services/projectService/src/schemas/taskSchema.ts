import { Schema } from "mongoose";

const TasksSchema: Schema = new Schema({
    Task_id: { type: String, required: true, unique: true },
    Created_at: { type: Date, required: true },
    Project_id: { type: Schema.Types.ObjectId, required: true },
    branch_id: { type: Schema.Types.ObjectId, required: true },
    Project_manager_id: { type: Schema.Types.ObjectId, required: true },
    Title: { type: String, required: true },
    Developer_id: { type: Schema.Types.ObjectId, required: true },
    Description: { type: String, required: true },
    Due_date: { type: Date, required: true },
    Status: { type: String, required: true },
    Is_deleted: { type: Boolean, required: true },
  });

  export default TasksSchema