import { ThemeState } from '@/features/theme/themeSlice'
import React, { useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

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

interface Message {
    sender: string
    sender_name: string
    message: string
    timestamp: string
}

interface MessageWindowProps {
    userName: string
    message: Message[]
    socket: Socket
    activeRoom: string | null
    isGroupChat: boolean
    setActiveRoom: React.Dispatch<React.SetStateAction<string | null>>
}

function MessageWindow({ userName, message, socket, activeRoom, isGroupChat, setActiveRoom }: MessageWindowProps) {
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
    }

    return (
        <div className={`w-full h-full lg:p-6 ${activeRoom ? 'block' : 'hidden 2xl:block'}`}>

            <div className={`${background} h-full shadow-lg  `}>
                {
                    activeRoom ? (
                        <div className='h-full'>
                            <div className="relative flex items-center p-3 border-b  border-gray-700">
                                <div className='2xl:hidden'>
                                    <i className="fa-solid fa-arrow-left mr-10" style={{ color: '#ffffff' }} onClick={() => setActiveRoom(null)} />
                                </div>
                                {
                                    isGroupChat?<img className="object-cover w-10 h-10 rounded-full" src="/group.jpeg" alt="username" />:<img className="object-cover w-10 h-10 rounded-full" src="/profile.png" alt="username" />
                                }
                                
                                <span className="block ml-2 font-bold text-gray-100">{userName}</span>
                                {/* <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span> */}
                            </div>
                            <div className="relative w-full p-6 overflow-y-auto h-[78%]">
                                <ul className="space-y-2">
                                    {
                                        message.map((msg, index) => (
                                            <li key={index} className={`flex ${msg.sender === id ? 'justify-end' : 'justify-start'}`}>
                                                <div className="relative max-w-xl px-4 py-2 text-gray-100 bg-green-700 rounded shadow">
                                                    {isGroupChat && msg.sender !== id && (
                                                        <span className="block ">{msg.sender_name}</span>
                                                    )}
                                                    <span className="block font-bold">{msg.message}</span>
                                                    <span className="block text-xs text-gray-100">{new Date(msg.timestamp).toLocaleString()}</span>
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
