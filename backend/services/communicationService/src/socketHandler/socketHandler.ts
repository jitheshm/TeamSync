import { Namespace, Server, Socket } from 'socket.io';
import userAuth from '../middlewares/userAuth';
import { ITenantUserRepository } from '../repository/interfaces/ITenantUserRepository';
import TenantUserRepository from '../repository/implementations/TenantUserRepository';
import IMessage from '../entities/MessageEntity';
import { IChatNotificationService } from '../services/interfaces/IChatNotificationService';
import ChatNotoficationService from '../services/implementations/ChatNotificationService';
import { IChatNotificationRepository } from '../repository/interfaces/IChatNotificationRepository';
import ChatNotificationRepository from '../repository/implementations/ChatNotificationRepository';
import mongoose from 'mongoose';
import ChatService from '../services/implementations/ChatService';
import { IChatService } from '../services/interfaces/IChatService';
import ChatRepository from '../repository/implementations/ChatRepository';
import { IMessageService } from '../services/interfaces/IMessageService';
import MessageService from '../services/implementations/MessageService';
import MessageRepository from '../repository/implementations/MessageRepository';
import { ITenantUserService } from '../services/interfaces/ITenantUserService';
import TenantUserService from '../services/implementations/TenantUserService';
import { IChatRepository } from '../repository/interfaces/IChatRepository';

const tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
const chatNotificationRepository: IChatNotificationRepository = new ChatNotificationRepository()
const chatRepository: IChatRepository = new ChatRepository()
const chatService: IChatService = new ChatService(chatRepository)
const messageRepository = new MessageRepository()
const messageService: IMessageService = new MessageService(messageRepository)
const chatNotificationService: IChatNotificationService = new ChatNotoficationService(chatNotificationRepository)
const tenantUserService: ITenantUserService = new TenantUserService(tenantUserRepository)
const userActivity = new Map()
const ServerActiveUsers = new Map()

const socketHandler = (io: Namespace) => {

    io.use(userAuth);

    io.on('connection', async (socket: Socket) => {
        try {
            console.log('A user connected:', socket.id);
            let userId = socket.data.user.id
            if (!ServerActiveUsers.has(userId.toString())) {
                ServerActiveUsers.set(userId.toString(), socket.id)
            }

            console.log(socket.data.user);
            let recentChats = await chatService.fetchAllChats(socket.data.user.tenantId, socket.data.user.id);
            console.log(recentChats);

            socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })




            socket.on('join_room', async ({ id, type }, callback: (response: { status: string; message: string; groupId?: string }) => void) => {
                try {
                    let joinId = id
                    console.log(id, type);

                    socket.join(joinId);


                    if (userActivity.has(joinId.toString())) {
                        userActivity.get(joinId.toString()).add(socket.data.user.id?.toString())
                    } else {
                        userActivity.set(joinId, new Set([socket.data.user.id?.toString()]))
                    }
                    console.log(userActivity, "userActivity");


                    callback({ status: 'success', message: `Joined room ${joinId}`, groupId: joinId });


                    const prevMessages = await messageService.fetchMessages(socket.data.user.tenantId, joinId)

                    socket.emit('previous_messages', { status: 'success', message: 'Previous messages', data: prevMessages })
                    await chatNotificationService.deleteChatNotification(socket.data.user.tenantId, new mongoose.Types.ObjectId(joinId), new mongoose.Types.ObjectId(socket.data.user.id))

                    recentChats = await chatService.fetchAllChats(socket.data.user.tenantId, socket.data.user.id)


                    // socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: await fetchAllChats(socket.data.user.tenantId, socket.data.user.id) })
                    socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })
                    console.log(`User ${socket.id} joined room ${joinId}`);
                } catch (error) {
                    console.log(error);
                    callback({ status: 'error', message: 'Error joining room' })
                }
            });

            socket.on('leave_room', (id) => {
                try {

                    socket.leave(id);
                    userActivity.get(id.toString())?.delete(socket.data.user.id?.toString())
                    console.log(socket.data.user.id, ">>>>>>");

                    console.log(userActivity, "userActivity");

                    console.log(`User ${socket.id} left room ${id}`);
                } catch (error) {
                    console.log(error);
                }

            });

            socket.on('new_chat', async (email) => {
                try {
                    const roomId = [email, socket.data.user.email].sort().join('-')
                    const chatObj = await chatService.fetchChats(socket.data.user.tenantId, roomId);

                    console.log(chatObj, ">>>>>>.");

                    if (!chatObj) {

                        const userData = await tenantUserService.fetchTenantUserByEmail(email, socket.data.user.tenantId)

                        if (!userData) {
                            console.log("User not found");

                            socket.emit('recent_chats', { status: 'user not found', message: 'Recent chats', data: recentChats })

                            return
                        }

                        console.log(roomId);

                        const dataObj = {
                            group_id: roomId,
                            // chat_id: roomId,
                            type: 'personal',
                            members: [userData._id, socket.data.user.id]
                        }
                        console.log(dataObj.members, ">>>>>>hai.");

                        await chatService.createChat(socket.data.user.tenantId, dataObj)



                    }

                    recentChats = await chatService.fetchAllChats(socket.data.user.tenantId, socket.data.user.id)


                    // socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: await fetchAllChats(socket.data.user.tenantId, socket.data.user.id) })
                    socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })

                    // callback({ status: 'success', message: `Chat started with ${email}`, groupId: roomId });
                } catch (error) {
                    console.log(error);

                }
            });



            socket.on('message', async (data) => {
                try {
                    const { message, groupId } = data;
                    console.log(data);
                    data.sender = socket.data.user.id;

                    const dataObj = {
                        message: data.message,
                        sender: data.sender,
                        timestamp: new Date(),
                        group_id: data.groupId,
                        sender_name: data.sender_name,
                        is_deleted: false
                    }
                    messageService.createMessage(socket.data.user.tenantId, dataObj as IMessage);

                    io.to(groupId).emit('new_message', dataObj);
                    console.log(userActivity.get(groupId.toString()), "userActivity");

                    let activeUsers = userActivity.get(groupId.toString()) ? [...userActivity.get(groupId.toString())] : [];
                    console.log(activeUsers, "activeUsers");
                    activeUsers = activeUsers.map((user) => new mongoose.Types.ObjectId(user))

                    const inactiveUsers = await chatService.fetchInactiveUsers(socket.data.user.tenantId, new mongoose.Types.ObjectId(groupId), activeUsers)
                    console.log(inactiveUsers, "inactiveUsers");

                    await chatNotificationService.createChatNotification(socket.data.user.tenantId, groupId, inactiveUsers)
                    console.log(ServerActiveUsers, "ServerActiveUsers");

                    inactiveUsers.forEach(async (user) => {
                        console.log(user, "user");

                        console.log(ServerActiveUsers.has(user.toString()));

                        if (ServerActiveUsers.has(user.toString())) {
                            console.log('hai');

                            let userRecentChats = await chatService.fetchAllChats(socket.data.user.tenantId, user)
                            io.to(ServerActiveUsers.get(user.toString())).emit('recent_chats', { status: 'success', message: 'Recent chats', data: userRecentChats })
                            io.to(ServerActiveUsers.get(user.toString())).emit('notify_user', { status: 'success', message: 'New message received' })
                        }
                    })
                    console.log(inactiveUsers, "inactiveUsers");
                } catch (error) {
                    console.log(error);

                }



            });

            socket.on('delete_message', async (data, callback) => {
                try {
                    console.log(data);
                    await messageService.deleteMessage(socket.data.user.tenantId, new mongoose.Types.ObjectId(data.msgId))
                    callback({ status: 'success', message: 'Message deleted' })

                } catch (error) {
                    console.log(error);
                    callback({ status: 'error', message: 'Error deleting message' })
                }

            })

            socket.on('disconnect', () => {
                try {
                    ServerActiveUsers.delete(userId.toString())
                    console.log('User disconnected:', socket.id);
                } catch (error) {
                    console.log(error);

                }
            });
        } catch (error) {
            console.log(error);
            socket.disconnect()

        }
    });
};

export default socketHandler; 
