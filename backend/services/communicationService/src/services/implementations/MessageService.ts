import IMessage from "../../entities/MessageEntity";
import { IMessageRepository } from "../../repository/interfaces/IMessageRepository";
import { IMessageService } from "../interfaces/IMessageService";




export default class MessageService implements IMessageService {
    private messageRepository: IMessageRepository;

    constructor(messageRepository: IMessageRepository) {
        this.messageRepository = messageRepository;
    }

    async createMessage(dbId: string, data: IMessage): Promise<void> {
        try {
            await this.messageRepository.create(dbId, data);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create message");
        }
    }
}
