import { Namespace, Server, Socket } from 'socket.io';
import userAuth from '../middlewares/userAuth';
import IMessage from '../entities/MessageEntity';
import { IChatNotificationService } from '../services/interfaces/IChatNotificationService';
import mongoose from 'mongoose';
import { IChatService } from '../services/interfaces/IChatService';
import { IMessageService } from '../services/interfaces/IMessageService';
import { ITenantUserService } from '../services/interfaces/ITenantUserService';
import { container } from '../config/inversify/inversify';



const chatService = container.get<IChatService>("IChatService");
const messageService = container.get<IMessageService>("IMessageService");
const chatNotificationService = container.get<IChatNotificationService>("IChatNotificationService");
const tenantUserService = container.get<ITenantUserService>("ITenantUserService");
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


                    const { prevMessages, recentChats } = await chatService.joinRoom(socket.data.user.tenantId, socket.data.user.id, joinId)

                    socket.emit('previous_messages', { status: 'success', message: 'Previous messages', data: prevMessages })

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

                    const recentChats = await chatService.newChat(socket.data.user.tenantId, roomId, new mongoose.Types.ObjectId(socket.data.user.id), email)
                    if (!recentChats) {
                        return
                    }

                    // socket.emit(online'recent_chats', { status: 'success', message: 'Recent chats', data: await fetchAllChats(socket.data.user.tenantId, socket.data.user.id) })
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
