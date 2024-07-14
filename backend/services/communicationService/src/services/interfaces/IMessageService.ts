import mongoose from "mongoose";
import IMessage from "../../entities/MessageEntity";

export interface IMessageService {
    createMessage(dbId: string, data: IMessage): Promise<void>;
    fetchMessages(dbId: string, groupId: string): Promise<(IMessage & mongoose.Document<unknown, any, any>)[]>
}