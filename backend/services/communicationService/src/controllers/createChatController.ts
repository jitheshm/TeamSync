import IChats from "../entities/ChatEntity";
import ChatRepository from "../repository/implementations/ChatRepository";
import { IChatRepository } from "../repository/interfaces/IChatRepository";
import ChatService from "../services/implementations/ChatService";

const chatRepository: IChatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

export default async (dbId: string, data: IChats) => {
    try {
        await chatService.createChat(dbId, data);
    } catch (error) {
        console.log(error);
    }
}
