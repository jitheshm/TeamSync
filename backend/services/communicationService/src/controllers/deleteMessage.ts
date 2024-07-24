import mongoose from "mongoose";
import IMessage from "../entities/MessageEntity";
import MessageRepository from "../repository/implementations/MessageRepository";
import MessageService from "../services/implementations/MessageService";

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);

export default async (dbId: string, msgId: string) => {
    try {

        await messageService.deleteMessage(dbId, new mongoose.Types.ObjectId(msgId))
    } catch (error) {
        console.log(error);
    }
};
