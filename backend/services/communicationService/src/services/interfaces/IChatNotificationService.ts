import mongoose from "mongoose";


export interface IChatNotificationService {
    createChatNotification(dbId: string, chat_id: mongoose.Types.ObjectId, userIds: mongoose.Types.ObjectId[]): Promise<void>
    deleteChatNotification(dbId: string, chat_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<void>
}
