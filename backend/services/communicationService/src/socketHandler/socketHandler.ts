import { Server, Socket } from 'socket.io';
import userAuth from '../middlewares/userAuth';
import fetchChatController from '../controllers/fetchChatController';
import createChatController from '../controllers/createChatController';
import fetchAllChats from '../controllers/fetchAllChats';
import createMessageController from '../controllers/createMessageController';
import fetchAllMessages from '../controllers/fetchAllMessages';
import { IUserRepository } from '../repository/interfaces/IUserRepository';
import { ITenantUserRepository } from '../repository/interfaces/ITenantUserRepository';
import TenantUserRepository from '../repository/implementations/TenantUserRepository';
import IMessage from '../entities/MessageEntity';
import deleteMessage from '../controllers/deleteMessage';

const tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
const socketHandler = (io: Server) => {

    io.use(userAuth);

    io.on('connection', async (socket: Socket) => {
        console.log('A user connected:', socket.id);
        console.log(socket.data.user);
        let recentChats = await fetchAllChats(socket.data.user.tenantId, socket.data.user.id)
        console.log(recentChats);

        socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })




        socket.on('join_room', async ({ id, type }, callback: (response: { status: string; message: string; groupId?: string }) => void) => {
            let joinId = id
            console.log(id, type);

            // if (type === 'personal') {
            //     if(role!='Tenant_admin'){

            //     }else{

            //     }

            //     const roomId = [id, socket.data.user._id].sort().join('-')
            //     const chatObj = fetchChatController(socket.data.user.tenantId, roomId)
            //     if (!chatObj) {
            //         const dataObj = {
            //             groupId: roomId,
            //             chat_id: roomId,
            //             type: 'personal',
            //             members: [id, socket.data.user._id]
            //         }
            //         createChatController(socket.data.user.tenantId, dataObj)
            //     }

            //     joinId = roomId


            // } else {
            //     joinId = id
            // }


            socket.join(joinId);

            callback({ status: 'success', message: `Joined room ${joinId}`, groupId: joinId });

            const prevMessages = await fetchAllMessages(socket.data.user.tenantId, joinId)

            socket.emit('previous_messages', { status: 'success', message: 'Previous messages', data: prevMessages })

            console.log(`User ${socket.id} joined room ${joinId}`);
        });

        socket.on('leave_room', (id) => {

            socket.leave(id);
            console.log(`User ${socket.id} left room ${id}`);

        });

        socket.on('new_chat', async (email) => {
            const roomId = [email, socket.data.user.email].sort().join('-')
            const chatObj = await fetchChatController(socket.data.user.tenantId, roomId)
            console.log(chatObj, ">>>>>>.");

            if (!chatObj) {

                const userData = await tenantUserRepository.fetchTenantUserByEmail(email, socket.data.user.tenantId)

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

                await createChatController(socket.data.user.tenantId, dataObj)


            }

            recentChats = await fetchAllChats(socket.data.user.tenantId, socket.data.user.id)

            // socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: await fetchAllChats(socket.data.user.tenantId, socket.data.user.id) })
            socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })

            // callback({ status: 'success', message: `Chat started with ${email}`, groupId: roomId });
        });



        socket.on('message', (data) => {
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
            createMessageController(socket.data.user.tenantId, dataObj as IMessage);
            io.to(groupId).emit('new_message', dataObj);
        });

        socket.on('delete_message', async (data, callback) => {
            try {
                console.log(data);
                await deleteMessage(socket.data.user.tenantId, data.msgId)
                callback({ status: 'success', message: 'Message deleted' })

            } catch (error) {
                console.log(error);
                callback({ status: 'error', message: 'Error deleting message' })
            }

        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default socketHandler;
