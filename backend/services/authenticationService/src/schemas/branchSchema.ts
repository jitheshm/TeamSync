import { Schema } from "mongoose";

const BranchesSchema: Schema = new Schema({
  location: { type: String, required: true },
  branch_id: { type: String, required: true, unique: true },
  is_deleted: { type: Boolean, default: false },

});

export default BranchesSchema;