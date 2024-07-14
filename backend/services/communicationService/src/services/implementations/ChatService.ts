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
}
