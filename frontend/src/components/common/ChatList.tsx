"use client"
import React, { useMemo } from 'react'
import { Input } from '../ui/input'
import ChatCard from './Cards/ChatCard'
import { useSelector } from 'react-redux'
import randomColor from 'randomcolor'
import fontColorContrast from 'font-color-contrast'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}
interface RootState {
    user: UserState
}

function ChatList({ recent, handleRoomChange, activeRoom, setIsModalOpen }: { recent: any[], handleRoomChange: (chat: any, bgColor: string, textFont: string) => void, activeRoom: string | null, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { id, verified } = useSelector((state: RootState) => state.user)
    return (
        <div className={` border-r border-border ${activeRoom ? 'hidden md:block md:w-4/12' : 'block w-screen  md:w-4/12'} `}>
            <div className='p-3'>
                <Input type="text" placeholder="Search here" />
            </div>
            <div>
                {recent.map((chat) => {

                    return (
                        <ChatCard key={chat._id} chat={chat} handleRoomChange={handleRoomChange} />
                    )
                })}


            </div>
        </div>
    )
}

export default ChatList