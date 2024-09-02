import fontColorContrast from 'font-color-contrast'
import randomColor from 'randomcolor'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}
interface RootState {
    user: UserState
}

interface ChatCardProps {
    chat: any
    handleRoomChange: (chat: any, bgColor: string, textFont: string) => void
}


function ChatCard({ chat, handleRoomChange }: ChatCardProps) {
    const { id, verified } = useSelector((state: RootState) => state.user)
    const bgColor = useMemo(randomColor,[])
    const textFont = fontColorContrast(bgColor[0])


    return (
        <div className='flex justify-between p-4 cursor-pointer ' onClick={() => handleRoomChange(chat, bgColor, textFont)}>
            <div className='flex'>
                <div className='w-6 h-6 me-5 p-4 rounded-full flex justify-center items-center' style={{ backgroundColor: bgColor, color: textFont }}>
                    {chat.type === 'group' ? chat.name.charAt(0).toUpperCase() : chat.members.filter((member: any) => member._id !== id)[0].name.charAt(0).toUpperCase()}
                </div>
                <div className='w-full flex items-center'>
                    {chat.type === 'group' ? chat.name : chat.members.filter((member: any) => member._id !== id)[0].name}
                </div>
            </div>

        </div>
    )
}

export default ChatCard