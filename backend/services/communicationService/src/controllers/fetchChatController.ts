import ChatRepository from "../repository/implementations/ChatRepository";
import ChatService from "../services/implementations/ChatService";

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

export default async (dbId: string, groupId: string) => {
    try {
        console.log("Fetching chats for group:", groupId);
        
        return await chatService.fetchChats(dbId, groupId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch chats");
    }
};
