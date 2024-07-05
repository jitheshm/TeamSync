import { Schema } from "mongoose";

const ProjectsSchema: Schema = new Schema({
  name: { type: String, required: true },
  project_id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  developers_id: [{ type: Schema.Types.ObjectId, required: true, }],
  stage: { type: String, required: true, enum: ['pending', 'development', 'testing', 'completed'], default: 'pending' },
  project_manager_id: { type: Schema.Types.ObjectId, required: true },
  end_date: { type: Date, required: true },
  start_date: { type: Date, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  branch_id: { type: Schema.Types.ObjectId, required: true },
  client_name: { type: String, required: true },
  tester_id: { type: Schema.Types.ObjectId, required: true },
  is_deleted: { type: Boolean, required: true, default: false },
});

export default ProjectsSchema;