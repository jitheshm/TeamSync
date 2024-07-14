import IChats from "../../entities/ChatEntity";

export interface IChatService {
    createChat(dbId: string, data: IChats): Promise<void>;
}
