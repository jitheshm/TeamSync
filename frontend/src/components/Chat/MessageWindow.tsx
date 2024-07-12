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
}

interface Message {
    sender: string
    message: string
}

interface MessageWindowProps {
    name: string
    message: Message[]
    socket: Socket
    activeRoom: string
}

function MessageWindow({ name, message, socket, activeRoom }: MessageWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const { id, verified } = useSelector((state: RootState) => state.user)

    const handleMessageSent = () => {
        socket.emit('message', {
            message: newMessage,
            groupId: activeRoom
        })
        setNewMessage('')
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
    }

    return (
        <div className="hidden lg:col-span-2 lg:block bg-[url('/chat.jpg')] bg-cover">
            <div className="w-full bg-gray-700 bg-opacity-60 h-full">
                <div className="relative flex items-center p-3 border-b border-gray-300">
                    <img className="object-cover w-10 h-10 rounded-full" src="https://static.vecteezy.com/system/resources/previews/029/310/139/original/eps10-illustration-of-crowd-of-black-people-icon-user-group-network-sign-corporate-team-group-symbol-isolated-on-white-background-community-member-icon-business-team-work-activity-vector.jpg" alt="username" />
                    <span className="block ml-2 font-bold text-gray-100">{name}</span>
                    <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
                </div>
                <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                    <ul className="space-y-2">
                        {
                            message.map((msg, index) => (
                                <li key={index} className={`flex ${msg.sender === id ? 'justify-end' : 'justify-start'}`}>
                                    <div className="relative max-w-xl px-4 py-2 text-gray-100 bg-green-600 rounded shadow">
                                        <span className="block">{msg.message}</span>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
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
        </div>
    )
}

export default MessageWindow
