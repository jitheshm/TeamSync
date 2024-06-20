import { ObjectId } from 'mongoose';

export interface IAdmin {
    _id?: ObjectId;
    user_name: string;
    password: string;
}
