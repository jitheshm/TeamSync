import { Schema } from 'mongoose';
import { IOtp } from '../entities/OtpEntity';

const OtpSchema: Schema = new Schema<IOtp>({
    email: { type: String, required: true },
    createdAt: { type: Date, expires: '2m', default: Date.now, required: true },
    context: { type: String, required: true },
    otp: { type: String, required: true }
});

OtpSchema.pre('save', function(next) {
    this.createdAt = new Date();
    next();
});

OtpSchema.pre('updateOne', function(next) {
    this.set({ createdAt: new Date() });
    next();
});

OtpSchema.pre('findOneAndUpdate', function(next) {
    this.set({ createdAt: new Date() });
    next();
});

export default OtpSchema;
