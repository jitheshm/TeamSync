import MessageRepository from "../repository/implementations/MessageRepository";
import MessageService from "../services/implementations/MessageService";

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);

export default async (dbId: string, groupId: string) => {
    try {
        console.log("Fetching messages for group:", groupId);
        
        return await messageService.fetchMessages(dbId, groupId);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch messages");
    }
};
