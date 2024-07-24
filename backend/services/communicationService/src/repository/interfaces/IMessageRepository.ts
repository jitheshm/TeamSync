import mongoose, { Document, mongo, Mongoose, ObjectId, UpdateWriteOpResult } from "mongoose";
import IMessage from "../../entities/MessageEntity";


export interface IMessageRepository {
    create(dbId: string, data: IMessage): Promise<void>
    fetchMessages(dbId: string, group_id: string): Promise<(IMessage & Document)[]>
    deleteMessage(dbId: string, msgId: mongoose.Types.ObjectId): Promise<void>


}