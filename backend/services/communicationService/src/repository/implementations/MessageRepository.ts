
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import IMessage from "../../entities/MessageEntity";
import { IMessageRepository } from "../interfaces/IMessageRepository";







export default class MessageRepository implements IMessageRepository {

    async create(dbId: string, data: IMessage) {
        try {
            const MessageModel = switchDb<IMessage>(`${process.env.SERVICE}_${dbId}`, 'messages')
            const newMsg = new MessageModel(data)
            await newMsg.save()
            return
        } catch (error) {
            console.log('Error in message Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchMessages(dbId: string, group_id: string) {
        try {
            console.log(dbId);

            const MessageModel = switchDb<IMessage>(`${process.env.SERVICE}_${dbId}`, 'messages')
            const data = await MessageModel.find({ group_id: group_id, is_deleted: false }).sort({ created_at: 1 })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in message Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async deleteMessage(dbId: string, msgId: mongoose.Types.ObjectId) {
        try {
            const MessageModel = switchDb<IMessage>(`${process.env.SERVICE}_${dbId}`, 'messages')
            console.log(msgId,dbId);
            
            await MessageModel.updateOne({ _id: msgId }, { is_deleted: true })
            return
        } catch (error) {
            console.log('Error in message Repository delete method');

            console.log(error);

            throw error
        }
    }






}