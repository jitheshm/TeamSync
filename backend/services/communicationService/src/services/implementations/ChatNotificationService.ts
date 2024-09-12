import mongoose from "mongoose";
import { IChatNotificationRepository } from "../../repository/interfaces/IChatNotificationRepository";
import { IChatNotificationService } from "../interfaces/IChatNotificationService";
import { inject, injectable } from "inversify";




@injectable()

export default class ChatNotificationService implements IChatNotificationService {
    private chatNotificationRepository: IChatNotificationRepository;

    constructor(
        @inject("IChatNotificationRepository") chatNotificationRepository: IChatNotificationRepository,
    ) {
        this.chatNotificationRepository = chatNotificationRepository;
    }

    async createChatNotification(dbId: string, chat_id: mongoose.Types.ObjectId, userIds: mongoose.Types.ObjectId[]): Promise<void> {
        try {
            await this.chatNotificationRepository.create(dbId, chat_id, userIds);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create chat");
        }
    }

    async deleteChatNotification(dbId: string, chat_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<void> {
        try {
            await this.chatNotificationRepository.delete(dbId, chat_id, userId);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete chat");
        }
    }


}
