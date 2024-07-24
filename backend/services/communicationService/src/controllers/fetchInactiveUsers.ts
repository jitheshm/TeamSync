import mongoose from "mongoose";
import ChatRepository from "../repository/implementations/ChatRepository";
import ChatService from "../services/implementations/ChatService";
import { IChatService } from "../services/interfaces/IChatService";
import { IChatRepository } from "../repository/interfaces/IChatRepository";

const chatRepository: IChatRepository = new ChatRepository();
const chatService: IChatService = new ChatService(chatRepository);

export default async (dbId: string, groupId: string, activeUsers: mongoose.Types.ObjectId[]) => {
    try {
        console.log("Fetching chats for group:", groupId);

        return await chatService.fetchInactiveUsers(dbId, new mongoose.Types.ObjectId(groupId), activeUsers);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch chats");
    }
};
