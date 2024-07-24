import { ThemeState } from '@/features/theme/themeSlice'
import React, { useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import DropDown from './DropDown'
import IMessage from '@/interfaces/Messages'
import Swal from 'sweetalert2'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}

interface RootState {
    user: UserState
    theme: ThemeState
}


interface MessageWindowProps {
    userName: string
    message: IMessage[]
    socket: Socket
    activeRoom: string | null
    isGroupChat: boolean
    setActiveRoom: React.Dispatch<React.SetStateAction<string | null>>
    setMessage: React.Dispatch<React.SetStateAction<IMessage[]>>
}

function MessageWindow({ userName, message, socket, activeRoom, isGroupChat, setActiveRoom, setMessage }: MessageWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const { id, verified, name } = useSelector((state: RootState) => state.user)
    const { background, text } = useSelector((state: RootState) => state.theme)


    const handleMessageSent = () => {
        socket.emit('message', {
            sender: id,
            sender_name: name,
            message: newMessage,
            groupId: activeRoom
        })
        setNewMessage('')
    }

    const handleMessageDelete = (msgId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                socket.emit('delete_message', {
                    msgId
                }, (data: { status: string, message: string }) => {
                    if (data.status === 'success') {
                        setMessage((prev) => {
                            return prev.filter((msg) => msg._id !== msgId)
                        })
                    }
                })
            }
        })
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
    }

    const handleRoomLeave = () => {
        socket.emit('leave_room', activeRoom)
        setActiveRoom(null)
    }

    return (
        <div className={`w-full h-full lg:p-6 ${activeRoom ? 'block' : 'hidden 2xl:block'}`}>

            <div className={`${background} h-full shadow-lg  `}>
                {
                    activeRoom ? (
                        <div className='h-full'>
                            <div className="relative flex items-center p-3 border-b  border-gray-700">
                                <div className='2xl:hidden'>
                                    <i className="fa-solid fa-arrow-left mr-10" style={{ color: '#ffffff' }} onClick={handleRoomLeave} />
                                </div>
                                {
                                    isGroupChat ? <img className="object-cover w-10 h-10 rounded-full" src="/group.jpeg" alt="username" /> : <img className="object-cover w-10 h-10 rounded-full" src="/profile.png" alt="username" />
                                }

                                <span className="block ml-2 font-bold text-gray-100">{userName}</span>
                                {/* <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span> */}
                            </div>
                            <div className="relative w-full p-6 overflow-y-auto h-[78%]">
                                <ul className="space-y-2">
                                    {
                                        message.map((msg, index) => (
                                            <li key={index} className={`flex ${msg.sender === id ? 'justify-end' : 'justify-start'}`}>
                                                <div className="relative max-w-xl px-7 py-2 text-gray-100 bg-[#202C33] rounded shadow">

                                                    <div className='absolute top-0 right-3'>
                                                        <DropDown msgId={msg._id} handleMessageDelete={handleMessageDelete} />

                                                    </div>
                                                    {isGroupChat && msg.sender !== id && (
                                                        <span className="block  font-bold text-orange-600">{msg.sender_name}</span>
                                                    )}
                                                    <span className="block font-bold mt-4">{msg.message}</span>
                                                    <p className="block text-xs text-gray-300 mt-5 text-end">{new Date(msg.timestamp).toLocaleString()}</p>
                                                </div>




                                            </li>

                                        ))
                                    }
                                </ul>
                            </div>
                            <div className="flex items-center justify-between w-full p-3 border-t border-gray-700">
                                <input
                                    type="text"
                                    onChange={handleInputChange}
                                    placeholder="Type Message Here"
                                    className="block w-full py-2 pl-4 mx-3 bg-gray-900 rounded-full outline-none text-gray-100"
                                    name="message"
                                    value={newMessage}
                                    required
                                />
                                <button type="submit" onClick={handleMessageSent}>
                                    <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (<div></div>)
                }
            </div>

        </div>
    )
}

export default MessageWindow
