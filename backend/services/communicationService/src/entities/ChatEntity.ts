import mongoose from "mongoose";

export default interface IChats{
    name?: string;
    group_id?: string;
    type: string;
    members: mongoose.Types.ObjectId[];
}