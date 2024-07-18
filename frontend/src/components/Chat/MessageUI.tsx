"use client"
import React, { useEffect, useState } from 'react'
import MessageWindow from './MessageWindow'
import { APIURL } from "../../constants/constant"
import Cookies from 'js-cookie'
import { Socket, io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import Modal from './Modal'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}

interface RootState {
    user: UserState
}

function ChatUI() {
    const [activeRoom, setActiveRoom] = useState<string | null>(null)
    const [activeName, setActiveName] = useState<string | null>(null)
    const [recent, setRecent] = useState([])
    const [message, setMessage] = useState([])
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
            if(chat.type === 'group'){
                setIsGroup(true)
            
            }else{
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
        <div className=" ms-10 mt-14 md:mt-0 bg-gray-950 ">
            <div className="min-w-full h-[90vh]   rounded lg:grid lg:grid-cols-3 mt-10">
                <div className={`${activeRoom?'hidden lg:block' : 'block'}  h-[97%] overflow-y-auto border-r-[0.5px] border-gray-700  lg:col-span-1 relative`}>
                    <div className="mx-3 my-3">
                        <div className="relative text-gray-100">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input type="search" className="block w-full py-2 pl-10 bg-gray-400 rounded outline-none" name="search" placeholder="Search" required />
                        </div>
                    </div>
                    <ul className="overflow-auto ">
                        <h2 className="my-2 mb-2 ml-2 text-lg text-gray-100">Chats</h2>
                        <li>
                            {recent.map((chat) => {
                                return (
                                    <div key={chat._id} onClick={() => handleRoomChange(chat)}>
                                        <div className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-600 focus:outline-none">
                                            <img className="object-cover w-10 h-10 rounded-full" src="/chatIcon.png" alt="username" />
                                            <div className="w-full pb-2">
                                                <div className="flex justify-between">
                                                    <span className="block ml-2 font-semibold text-gray-100">{
                                                        chat.type === 'group' ? chat.name : chat.members.filter((member: any) => member._id !== id)[0].name
                                                    }</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </li>
                    </ul>
                    <button
                        className="absolute bottom-4 right-4 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                {activeRoom ? <MessageWindow userName={activeName as string} message={message} socket={socket as Socket} activeRoom={activeRoom} isGroupChat={isGroup} setActiveRoom={setActiveRoom}/> : ""}
            </div>

            {isModalOpen && (
                <Modal onClose={onClose}>
                    <div className="bg-gray-700 p-6 rounded shadow-md">
                        <h2 className="text-lg mb-4">Start a new chat</h2>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 text-gray-950 rounded mb-4"
                            placeholder="Enter email"
                            value={newChatEmail}
                            onChange={(e) => setNewChatEmail(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-500 text-white p-2 rounded"
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

export default ChatUI
