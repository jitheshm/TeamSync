import IChats from "../entities/ChatEntity"
import ChatRepository from "../repository/implementations/ChatRepository"

const chatRepository = new ChatRepository()


export default async (dbId: string, data: IChats) => {
    try {
        await chatRepository.create(dbId, data)
    } catch (error) {
        console.log(error);
    }
}