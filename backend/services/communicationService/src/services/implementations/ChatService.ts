import mongoose from "mongoose";
import IChats from "../../entities/ChatEntity";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";
import { IChatService } from "../interfaces/IChatService";
import { IMessageRepository } from "../../repository/interfaces/IMessageRepository";
import { IChatNotificationRepository } from "../../repository/interfaces/IChatNotificationRepository";
import { inject, injectable } from "inversify";
import { ITenantUserRepository } from "../../repository/interfaces/ITenantUserRepository";



@injectable()
export default class ChatService implements IChatService {
    private chatRepository: IChatRepository;
    private messageRepository: IMessageRepository
    private chatNotificationRepository: IChatNotificationRepository;
    private tenantUserRepository: ITenantUserRepository;

    constructor(
        @inject("IChatRepository") chatRepository: IChatRepository,
        @inject("IMessageRepository") messageRepository: IMessageRepository,
        @inject("IChatNotificationRepository") chatNotificationRepository: IChatNotificationRepository,
        @inject("ITenantUserRepository") tenantUserRepository: ITenantUserRepository
    ) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.chatNotificationRepository = chatNotificationRepository;
        this.tenantUserRepository = tenantUserRepository;
    }

    async createChat(dbId: string, data: IChats): Promise<void> {
        try {
            await this.chatRepository.create(dbId, data);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create chat");
        }
    }

    async fetchAllChats(dbId: string, userId: string): Promise<(IChats & mongoose.Document<unknown, any, any>)[]> {
        try {
            const userOId = new mongoose.Types.ObjectId(userId);
            const result = await this.chatRepository.fechAllChats(dbId, userOId);
            return result
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch chats");
        }
    }

    async fetchChats(dbId: string, groupId: string): Promise<(IChats & mongoose.Document<unknown, any, any>) | null> {
        try {
            return await this.chatRepository.fechChats(dbId, groupId);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch chats");
        }
    }

    async fetchInactiveUsers(dbId: string, groupId: mongoose.Types.ObjectId, activeUsers: mongoose.Types.ObjectId[]) {
        try {
            return await this.chatRepository.fetchInactiveUsers(dbId, groupId, activeUsers);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch chats");
        }
    }

    async joinRoom(tenantId: string, userId: string, roomId: string) {

        const prevMessages = await this.messageRepository.fetchMessages(tenantId, roomId);
        await this.chatNotificationRepository.delete(tenantId, new mongoose.Types.ObjectId(roomId), new mongoose.Types.ObjectId(userId));
        const recentChats = await this.chatRepository.fechAllChats(tenantId, new mongoose.Types.ObjectId(userId));

        return { prevMessages, recentChats };

    }

    async newChat(dbId: string, roomId: string, userId: mongoose.Types.ObjectId, email: string) {
        const chatObj = await this.chatRepository.fechChats(dbId, roomId);

        if (!chatObj) {
            const userData = await this.tenantUserRepository.fetchTenantUserByEmail(email, dbId);

            if (!userData) {
                console.log("User not found");
                return
            }


            const dataObj: IChats = {
                group_id: roomId,
                type: 'personal',
                members: [userData._id, userId]
            }
            console.log(dataObj.members, ">>>>>>hai.");

            // await chatService.createChat(socket.data.user.tenantId, dataObj)
            await this.chatRepository.create(dbId, dataObj);
        }

        // recentChats = await chatService.fetchAllChats(socket.data.user.tenantId, socket.data.user.id)
        const result = await this.chatRepository.fechAllChats(dbId, userId);
        return result
    }
}
