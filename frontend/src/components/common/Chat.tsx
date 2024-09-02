"use client"
import React, { useEffect, useState } from 'react'

import ChatList from './ChatList'
import MessageWindow from './MessageWindow'
import IMessage from '@/interfaces/Messages'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { APIURL } from '@/constants/constant'

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
    const [iconStyle, setIconStyle] = useState<{ bgColor: string, textFont: string }>()

    useEffect(() => {
        const socketObj = io(`${APIURL}/api/chat`, {
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
            socket.on('notify_user', (data) => {
                console.log(data);

                // const Toast = Swal.mixin({
                //     toast: true,
                //     position: "top-end",
                //     showConfirmButton: false,
                //     timer: 3000,
                //     timerProgressBar: true,
                //     didOpen: (toast) => {
                //         toast.onmouseenter = Swal.stopTimer;
                //         toast.onmouseleave = Swal.resumeTimer;
                //     }
                // });
                // Toast.fire({

                //     title: data.message
                // });
            }
            )
        }

        return () => {
            socket && socket.disconnect()
        }
    }, [socket])

    const handleRoomChange = (chat: any, bgColor: string, textFont: string) => {
        if (socket) {
            setIconStyle({ bgColor, textFont })
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
                    let user = chat.members.filter((member: any) => {
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
        <div className='md:p-5'>
            <div className=' w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-6rem)] md:border border-border flex'>
                <ChatList recent={recent} handleRoomChange={handleRoomChange} activeRoom={activeRoom} setIsModalOpen={setIsModalOpen} />
                <MessageWindow iconStyle={iconStyle!} userName={activeName as string} message={message} socket={socket as Socket} activeRoom={activeRoom} isGroupChat={isGroup} setActiveRoom={setActiveRoom} setMessage={setMessage} />
            </div>
        </div>
    )
}

export default Chat