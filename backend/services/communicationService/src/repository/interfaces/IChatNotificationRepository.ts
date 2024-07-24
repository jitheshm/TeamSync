import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import IChats from "../../entities/ChatEntity";


export interface IChatNotificationRepository {
    create(dbId: string, chat_id: mongoose.Types.ObjectId, userIds: mongoose.Types.ObjectId[]): Promise<void>
    delete(dbId: string, chat_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<void>
    

}