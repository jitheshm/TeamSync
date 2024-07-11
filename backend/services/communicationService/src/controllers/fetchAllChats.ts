import mongoose from "mongoose"
import ChatRepository from "../repository/implementations/ChatRepository"

const chatRepository = new ChatRepository()

export default (dbId: string, id: string) => {
    try {
        console.log(id);
        
        const userId=new mongoose.Types.ObjectId(id)
        return chatRepository.fechAllChats(dbId, userId)
    } catch (error) {

    }
}