
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import IChats from "../../entities/ChatEntity";
import { IChatRepository } from "../interfaces/IChatRepository";






export default class ChatRepository implements IChatRepository {

    async create(dbId: string, data: IChats) {
        try {
            const ChatModel = switchDb<IChats>(`${process.env.SERVICE}_${dbId}`, 'chats')
            const newChat = new ChatModel(data)
            await newChat.save()
            return
        } catch (error) {
            console.log('Error in chat Repository create method');

            console.log(error);

            throw error
        }
    }
    async fechChats(dbId: string, group_id: string) {
        try {
            console.log(dbId);

            const ChatModel = switchDb<IChats>(`${process.env.SERVICE}_${dbId}`, 'chats')
            const data = await ChatModel.find({ group_id: group_id })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in chat Repository fetchUser method');

            console.log(error);

            throw error
        }
    }






}