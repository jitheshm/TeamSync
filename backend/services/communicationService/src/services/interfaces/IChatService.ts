import mongoose, { Document } from "mongoose";
import IChats from "../../entities/ChatEntity";
import IMessage from "../../entities/MessageEntity";

export interface IChatService {
    createChat(dbId: string, data: IChats): Promise<void>;
    fetchAllChats(dbId: string, userId: string): Promise<(IChats & mongoose.Document<unknown, any, any>)[]>
    fetchChats(dbId: string, groupId: string): Promise<(IChats & mongoose.Document<unknown, any, any>) | null>
    fetchInactiveUsers(dbId: string, groupId: mongoose.Types.ObjectId, activeUsers: mongoose.Types.ObjectId[]): Promise<any[]>
    joinRoom(tenantId: string, userId: string, roomId: string): Promise<{
        prevMessages: (IMessage & Document)[];
        recentChats: (IChats & Document)[];
    }>
    newChat(dbId: string, roomId: string, userId: mongoose.Types.ObjectId, email: string): Promise<(IChats & Document)[] | undefined>
}
