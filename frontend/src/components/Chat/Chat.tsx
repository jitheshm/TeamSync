"use client"
import React, { useEffect, useState } from 'react'
import ChatList from './ChatList'
import MessageWindow from './MessageWindow'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import Modal from './Modal'
import IMessage from '@/interfaces/Messages'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}

interface RootState {
    user: UserState
}

function Chat() {


    const [activeRoom, setActiveRoom] = useState<string | null>('')
    const [activeName, setActiveName] = useState<string | null>(null)
    const [recent, setRecent] = useState([])
    const [message, setMessage] = useState<IMessage[]>([])
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newChatEmail, setNewChatEmail] = useState('')
    const [isGroup, setIsGroup] = useState(false)
    const { id, verified } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        const socketObj = io('http://localhost:3006', {
            auth: {
                token: Cookies.get('team-sync-token')
            }
        })
        setSocket(socketObj)

        return () => {
            activeRoom && socketObj.emit('leave_room', activeRoom)
            socketObj.disconnect()
        } 
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('recent_chats', (data) => {
                console.log(data)
                setRecent(data.data)
            })

            socket.on('previous_messages', (dataObj) => {
                console.log(dataObj)
                setMessage(dataObj.data)
            })

            socket.on('new_message', (data) => {
                console.log(data)
                setMessage((prev) => {
                    return [...prev, data]
                })
            })
        }

        return () => {
            socket && socket.disconnect()
        }
    }, [socket])

    const handleRoomChange = (chat: any) => {
        if (socket) {
            console.log(chat.id)
            if (chat.type === 'group') {
                setIsGroup(true)

            } else {
                setIsGroup(false)

            }
            setActiveName(() => {
                if (chat.type === 'group') {
                    return chat.name
                } else {
                    let user = chat.members.filter((member) => {
                        return member._id !== id
                    })
                    return user[0].name
                }
            })
            activeRoom && socket.emit('leave_room', activeRoom)
            console.log(activeRoom);

            socket.emit('join_room', { id: chat._id, type: chat.type }, (response: any) => {
                console.log(response)
                setActiveRoom(response.groupId)
            })
        }
    }

    const handleNewChat = () => {
        // Logic to start a new chat with newChatEmail
        if (socket) {
            activeRoom && socket.emit('leave_room', activeRoom)

            socket.emit('new_chat', newChatEmail)
            // console.log('Starting chat with:', newChatEmail)

            setIsModalOpen(false)
        }
    }

    const onClose = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='w-screen flex'>
            <ChatList recent={recent} handleRoomChange={handleRoomChange} activeRoom={activeRoom} setIsModalOpen={setIsModalOpen} />
            <MessageWindow userName={activeName as string} message={message} socket={socket as Socket} activeRoom={activeRoom} isGroupChat={isGroup} setActiveRoom={setActiveRoom} setMessage={setMessage} />
            {isModalOpen && (
                <Modal onClose={onClose}>
                    <div className={` p-3 rounded shadow-md`}>
                        <h2 className="text-lg mb-4 text-center">Start a new chat</h2>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 text-gray-950 rounded mb-4"
                            placeholder="Enter email"
                            value={newChatEmail}
                            onChange={(e) => setNewChatEmail(e.target.value)}
                        />
                        <button
                            className="w-full bg-violet-700 text-white p-2 rounded"
                            onClick={handleNewChat}
                        >
                            Start Chat
                        </button>
                        <button
                            className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

        </div>
    )
}

export default Chat