import mongoose from "mongoose";
import { IChatNotificationRepository } from "../../repository/interfaces/IChatNotificationRepository";
import IChatNotfication from "../../entities/ChatNotification";
import { IChatNotificationService } from "../interfaces/IChatNotificationService";





export default class ChatNotoficationService implements IChatNotificationService {
    private chatNotificationRepository: IChatNotificationRepository;

    constructor(chatNotificationRepository: IChatNotificationRepository) {
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


}
