import IChats from "../entities/ChatEntity"
import IMessage from "../entities/MessageEntity"
import ChatRepository from "../repository/implementations/ChatRepository"
import MessageRepository from "../repository/implementations/MessageRepository"
import { IMessageRepository } from "../repository/interfaces/IMessageRepository"

const messageRepository: IMessageRepository = new MessageRepository()


export default async (dbId: string, data:IMessage) => {
    try {
        console.log(data,">>>>>>>>>>>>>");
        
        await messageRepository.create(dbId, data)
    } catch (error) {
        console.log(error);
    }
}