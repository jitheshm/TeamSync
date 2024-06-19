import { ObjectId } from 'mongoose';

export interface IOtp {
    _id?: ObjectId;
    email: string;
    otp: string;
    context: string;
    createdAt?: Date;
}
