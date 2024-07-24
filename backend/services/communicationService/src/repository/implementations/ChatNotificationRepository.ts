import mongoose from "mongoose";
import IChatNotfication from "../../entities/ChatNotification";
import switchDb from "../../utils/switchDb";
import { IChatNotificationRepository } from "../interfaces/IChatNotificationRepository";

export default class ChatNotificationRepository implements IChatNotificationRepository {
    async create(dbId: string, chat_id: mongoose.Types.ObjectId, userIds: mongoose.Types.ObjectId[]) {
        try {
            const ChatNotificationModel = switchDb<IChatNotfication>(`${process.env.SERVICE}_${dbId}`, 'chat_notifications')
            await ChatNotificationModel.bulkWrite(userIds.map(id => ({
                updateOne: {
                    filter: { user_id: id, chat_id: chat_id },
                    update: { $inc: { count: 1 } },
                    upsert: true // Create a new document if it doesn't exist
                }
            })))
            return


        } catch (error) {
            console.log(error);
            throw new Error("Failed to create chat");

        }
    }

    async delete(dbId: string, chat_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
        try {
            const ChatNotificationModel = switchDb<IChatNotfication>(`${process.env.SERVICE}_${dbId}`, 'chat_notifications')
            await ChatNotificationModel.deleteOne({ chat_id: chat_id, user_id: userId })
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete chat");
        }
    }
}