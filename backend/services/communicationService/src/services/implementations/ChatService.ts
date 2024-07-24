import mongoose from "mongoose";
import IChats from "../../entities/ChatEntity";
import { IChatRepository } from "../../repository/interfaces/IChatRepository";
import { IChatService } from "../interfaces/IChatService";




export default class ChatService implements IChatService {
    private chatRepository: IChatRepository;

    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository;
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
}
