import { Schema } from 'mongoose';
import { IAdmin } from '../entities/AdminEntity';



const AdminSchema: Schema = new Schema<IAdmin>({
    user_name: { type: String, required: true },
    password: { type: String, required: true },

});

export default AdminSchema;