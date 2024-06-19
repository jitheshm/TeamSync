import { Schema } from 'mongoose';
import { IOtp } from '../entities/OtpEntity';




const OtpSchema: Schema = new Schema<IOtp>({
    email: { type: String, required: true},
    createdAt: { type: Date, expires: '2m', default: Date.now ,required: true},
    context:{type:String,required:true},
    otp: { type: String, required: true }
});

export default OtpSchema;