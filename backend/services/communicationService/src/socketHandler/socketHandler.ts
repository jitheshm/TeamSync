import { Server, Socket } from 'socket.io';
import userAuth from '../middlewares/userAuth';
import fetchChatController from '../controllers/fetchChatController';
import createChatController from '../controllers/createChatController';
import fetchAllChats from '../controllers/fetchAllChats';
import createMessageController from '../controllers/createMessageController';
import fetchAllMessages from '../controllers/fetchAllMessages';

const socketHandler = (io: Server) => {

    io.use(userAuth);

    io.on('connection', async (socket: Socket) => {
        console.log('A user connected:', socket.id);
        console.log(socket.data.user);
        const recentChats = await fetchAllChats(socket.data.user.tenantId, socket.data.user.id)
        console.log(recentChats);

        socket.emit('recent_chats', { status: 'success', message: 'Recent chats', data: recentChats })




        socket.on('join_room', async({ id, type }, callback: (response: { status: string; message: string; groupId?: string }) => void) => {
            let joinId = null
            console.log(id, type);

            if (type === 'personal') {
                const roomId = [id, socket.data.user._id].sort().join('-')
                const chatObj = fetchChatController(socket.data.user.tenantId, roomId)
                if (!chatObj) {
                    const dataObj = {
                        groupId: roomId,
                        chat_id: roomId,
                        type: 'personal',
                        members: [id, socket.data.user._id]
                    }
                    createChatController(socket.data.user.tenantId, dataObj)
                }

                joinId = roomId


            } else {
                joinId = id
            }


            socket.join(joinId);

            callback({ status: 'success', message: `Joined room ${joinId}`, groupId: joinId });

            const prevMessages=await fetchAllMessages(socket.data.user.tenantId, joinId)

            socket.emit('previous_messages', { status: 'success', message: 'Previous messages', data: prevMessages })

            console.log(`User ${socket.id} joined room ${joinId}`);
        });

        socket.on('leave_room', (id) => {

            socket.leave(id);
            console.log(`User ${socket.id} left room ${id}`);


        });



        socket.on('message', (data) => {
            const { message, groupId } = data;
            console.log(data);
            data.sender = socket.data.user.id;

            const dataObj = {
                message: data.message,
                sender: data.sender,
                timestamp: new Date(),
                group_id: data.groupId
            }
            createMessageController(socket.data.user.tenantId, dataObj);
            io.to(groupId).emit('new_message', dataObj);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default socketHandler;
