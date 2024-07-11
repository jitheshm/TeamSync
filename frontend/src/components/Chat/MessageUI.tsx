"use client"
import React, { useEffect, useState } from 'react'
import MessageWindow from './MessageWindow'
import { APIURL } from "../../constants/constant"
import Cookies from 'js-cookie'
import { Socket, io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'

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
                console.log(data);
                setRecent(data.data)
            })

            socket.on('previous_messages', (dataObj) => {
                console.log(dataObj);
                setMessage(dataObj.data)
            })

            socket.on('new_message', (data) => {
                console.log(data);
                setMessage((prev) => {
                    return [...prev, data]
                })
            })
        }

        return () => {
            socket && socket.disconnect()
        }
    }, [socket])

    // useEffect(() => {
    //     if (socket) {
    //         socket.emit('join_room', )

    //         return () => {
    //             socket.emit('leave_room', activeRoom)
    //         }
    //     }
    // }, [activeRoom])

    const handleRoomChange = (chat: any) => {
        if (socket) {
            console.log(chat.id);
            setActiveName(() => {
                if (chat.type === 'group') {
                    return chat.name
                } else {
                    let user = chat.members.filter(((member) => {
                        return member._id !== id

                    }))
                    return user[0].name
                }
            })
            activeRoom && socket.emit('leave_room', activeRoom)
            socket.emit('join_room', { id: chat._id, type: chat.type }, (response: any) => {
                console.log(response);
                setActiveRoom(response.groupId)
            })

        }
    }

    return (

        <div className="container mx-auto mt-14 ">
            <div className="min-w-full min-h-[90vh] border rounded lg:grid lg:grid-cols-3">
                <div className="border-r border-gray-300 lg:col-span-1">
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
                    <ul className="overflow-auto h-[32rem]">
                        <h2 className="my-2 mb-2 ml-2 text-lg text-gray-100">Chats</h2>
                        <li>
                            {
                                recent.map((chat) => {
                                    return (
                                        <div key={''} onClick={() => handleRoomChange(chat)}>
                                            <div className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-600 focus:outline-none">
                                                <img className="object-cover w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg" alt="username" />
                                                <div className="w-full pb-2">
                                                    <div className="flex justify-between">
                                                        <span className="block ml-2 font-semibold text-gray-100">{chat.name}</span>
                                                        <span className="block ml-2 text-sm text-gray-100">25 minutes</span>
                                                    </div>
                                                    <span className="block ml-2 text-sm text-gray-100">bye</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-600 focus:outline-none">
                                <img className="object-cover w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg" alt="username" />
                                <div className="w-full pb-2">
                                    <div className="flex justify-between">
                                        <span className="block ml-2 font-semibold text-gray-100">Jhon Don</span>
                                        <span className="block ml-2 text-sm text-gray-100">25 minutes</span>
                                    </div>
                                    <span className="block ml-2 text-sm text-gray-100">bye</span>
                                </div>
                            </a>
                            <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out bg-gray-400 border-b border-gray-300 cursor-pointer focus:outline-none">
                                <img className="object-cover w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2016/06/15/15/25/loudspeaker-1459128__340.png" alt="username" />
                                <div className="w-full pb-2">
                                    <div className="flex justify-between">
                                        <span className="block ml-2 font-semibold text-gray-100">Same</span>
                                        <span className="block ml-2 text-sm text-gray-100">50 minutes</span>
                                    </div>
                                    <span className="block ml-2 text-sm text-gray-100">Good night</span>
                                </div>
                            </a>

                        </li>
                    </ul>
                </div>
                {
                    activeRoom ? <MessageWindow name={activeName as string} message={message} socket={socket as Socket} activeRoom={activeRoom} /> : ""
                }
            </div>
        </div>



    )
}

export default ChatUI