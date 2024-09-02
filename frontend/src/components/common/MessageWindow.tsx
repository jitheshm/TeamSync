import IMessage from '@/interfaces/Messages'
import fontColorContrast from 'font-color-contrast'
import randomColor from 'randomcolor'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { ScrollArea } from '../ui/scroll-area'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}

interface RootState {
    user: UserState
}


interface MessageWindowProps {
    userName: string
    message: IMessage[]
    socket: Socket
    activeRoom: string | null
    isGroupChat: boolean
    setActiveRoom: React.Dispatch<React.SetStateAction<string | null>>
    setMessage: React.Dispatch<React.SetStateAction<IMessage[]>>
    iconStyle: {
        bgColor: string,
        textFont: string
    }
}


function MessageWindow({ userName, message, socket, activeRoom, isGroupChat, setActiveRoom, setMessage, iconStyle }: MessageWindowProps) {
    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)
    const [newMessage, setNewMessage] = useState('')
    const { id, verified, name } = useSelector((state: RootState) => state.user)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollIntoView(false)
        }
    }, [message])

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
        <div className={`w-full ${activeRoom ? 'block' : 'hidden md:block'}`}>

            {
                activeRoom ? (
                    <>
                        <div className={`h-14 border-b border-border p-3 `}>
                            <div className='flex'>
                                <div className='w-6 h-6 me-5 p-4 rounded-full flex justify-center items-center' style={{ backgroundColor: iconStyle.bgColor, color: iconStyle.textFont }}>
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <div className='w-full flex items-center'>
                                    {userName}
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="relative w-full p-6 h-[80%]">
                            <div className="space-y-2" ref={scrollContainerRef}>
                                <ul  >
                                    {
                                        message.map((msg, index) => (
                                            <li key={index} className={`flex ${msg.sender === id ? 'justify-end' : 'justify-start'}`}>
                                                <div>
                                                    {isGroupChat && msg.sender !== id && (
                                                        <span className="block  font-bold text-orange-600">{msg.sender_name}</span>
                                                    )}
                                                    <div className="relative max-w-xl px-7 py-2 bg-primary text-text-white rounded shadow">

                                                        <div className='absolute top-0 right-3'>
                                                        </div>

                                                        <span className="block font-bold text-white ">{msg.message}</span>
                                                    </div>
                                                    <p className="block text-xs text-gray-700 dark:text-gray-300 text-start mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                                                </div>





                                            </li>

                                        ))
                                    }
                                </ul>
                            </div>

                        </ScrollArea>
                        <div className="flex items-center justify-between w-full p-2 border-t border-border">
                            <input
                                type="text"
                                onChange={handleInputChange}
                                placeholder="Type Message Here"
                                className="block w-full py-2 pl-4 mx-3  rounded-full outline-none text-black dark:text-gray-100"
                                name="message"
                                value={newMessage}
                                required
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleMessageSent()
                                    }
                                }}
                            />
                            <button type="submit" onClick={handleMessageSent}>
                                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </>

                ) : (<div></div>)
            }


        </div>
    )
}

export default MessageWindow