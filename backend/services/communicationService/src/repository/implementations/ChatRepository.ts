
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
            const data = await ChatModel.findOne({ group_id: group_id })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in chat Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async fechAllChats(dbId: string, userId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);
            console.log(userId);

            const ChatModel = switchDb<IChats>(`${process.env.SERVICE}_${dbId}`, 'chats')
            const recentChats = await ChatModel.aggregate([
                { $match: { members: userId } },

                {
                    $lookup: {
                        from: 'messages',
                        let: { group_id: '$group_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$group_id', '$$group_id'] } } },
                            { $sort: { timestamp: -1 } },
                            { $limit: 1 }
                        ],
                        as: 'lastMessage'
                    }
                },

                { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },

                {
                    $lookup: {
                        from: 'tenant_users',  
                        localField: 'members',
                        foreignField: '_id',
                        as: 'memberDetails'
                    }
                },

                {
                    $sort: {
                        'lastMessage.timestamp': -1,
                        createdAt: -1
                    }
                },

                {
                    $project: {
                        _id: 1,
                        name: 1,
                        group_id: 1,
                        chat_id: 1,
                        type: 1,
                        lastMessage: 1,
                        members: '$memberDetails'
                    }
                }
            ]);
            console.log(recentChats);

            return recentChats
        } catch (error) {
            console.log('Error in chat Repository fetchUser method');

            console.log(error);

            throw error
        }
    }






}