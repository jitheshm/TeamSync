import mongoose from "mongoose";
import ChatRepository from "../repository/implementations/ChatRepository";
import ChatService from "../services/implementations/ChatService";

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

export default async (dbId: string, id: string) => {
    try {
        console.log("Fetching chats for user:", id);

        return await chatService.fetchAllChats(dbId, id);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch chats");
    }
};
