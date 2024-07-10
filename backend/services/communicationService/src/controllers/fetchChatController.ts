import ChatRepository from "../repository/implementations/ChatRepository"

const chatRepository = new ChatRepository()

export default (dbId: string, groupId: string) => {
    try {
        return chatRepository.fechChats(dbId, groupId)
    } catch (error) {

    }
}