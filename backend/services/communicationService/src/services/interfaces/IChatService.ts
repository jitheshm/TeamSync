import mongoose from "mongoose";
import IChats from "../../entities/ChatEntity";

export interface IChatService {
    createChat(dbId: string, data: IChats): Promise<void>;
    fetchAllChats(dbId: string, userId: string): Promise<(IChats & mongoose.Document<unknown, any, any>)[]>
    fetchChats(dbId: string, groupId: string): Promise<(IChats & mongoose.Document<unknown, any, any>) | null>
}
