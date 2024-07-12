import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import IChats from "../../entities/ChatEntity";


export interface IChatRepository {
    create(dbId: string,data: IChats): Promise<void>
    fechChats(dbId: string,group_id:string): Promise<IChats & Document | null>
    fechAllChats(dbId: string, userId: mongoose.Types.ObjectId): Promise<(IChats & Document)[]>
    

}