import mongoose from "mongoose";
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

    async fetchMessages(dbId: string, groupId: string): Promise<(IMessage & mongoose.Document<unknown, any, any>)[]> {
        try {
            return await this.messageRepository.fetchMessages(dbId, groupId);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch messages");
        }
    }

    async deleteMessage(dbId: string, msgId: mongoose.Types.ObjectId): Promise<void> {
        try {
            await this.messageRepository.deleteMessage(dbId, msgId);
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete message");
        }
    }
}
