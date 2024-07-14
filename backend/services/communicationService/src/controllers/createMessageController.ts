import IMessage from "../entities/MessageEntity";
import MessageRepository from "../repository/implementations/MessageRepository";
import MessageService from "../services/implementations/MessageService";

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);

export default async (dbId: string, data: IMessage) => {
    try {
        console.log("Received message data:", data);
        await messageService.createMessage(dbId, data);
    } catch (error) {
        console.log(error);
    }
};
