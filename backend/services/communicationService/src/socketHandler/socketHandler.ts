import { Server, Socket } from 'socket.io';
import userAuth from '../middlewares/userAuth';
import fetchChatController from '../controllers/fetchChatController';
import createChatController from '../controllers/createChatController';

const socketHandler = (io: Server) => {

    io.use(userAuth);

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join_room', ({ id, type }, callback: (response: { status: string; message: string; groupId?: string }) => void) => {
            let joinId = null
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
            console.log(`User ${socket.id} joined room ${joinId}`);
        });

        socket.on('leave_room', ({ id, type }) => {

            if (type === 'personal') {
                const roomId = [id, socket.data.user._id].sort().join('-')
                socket.leave(roomId);
                console.log(`User ${socket.id} left room ${roomId}`);
            } else {
                socket.leave(id);
                console.log(`User ${socket.id} left room ${id}`);
            }

        });



        socket.on('message', (data) => {
            const { message, sender, groupId } = data;

            // Save message to MongoDB (you should implement the actual saving logic here)
            // const newMessage = new Message({ message, sender, group: groupId });
            // newMessage.save();

            // Emit the message to the room
            io.to(groupId).emit('message', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default socketHandler;
