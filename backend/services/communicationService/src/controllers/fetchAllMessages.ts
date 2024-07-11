import mongoose from "mongoose"
import MessageRepository from "../repository/implementations/MessageRepository";

const messageRepository = new MessageRepository()

export default async (dbId: string, groupId: string) => {
    try {
        console.log(groupId);
        
        return await  messageRepository.fetchMessages(dbId, groupId)
    } catch (error) {

    }
}