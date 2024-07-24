"use client"
import { ThemeState } from '@/features/theme/themeSlice'
import React from 'react'
import { useSelector } from 'react-redux'


interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}
interface RootState {
    theme: ThemeState
    user: UserState
}

function ChatList({ recent, handleRoomChange, activeRoom, setIsModalOpen }: { recent: any[], handleRoomChange: (chat: any) => void, activeRoom: string | null, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { background, text } = useSelector((state: RootState) => state.theme)
    const { id, verified } = useSelector((state: RootState) => state.user)


    return (

        <div className={`h-full lg:p-6  ${activeRoom ? 'hidden 2xl:block 2xl:w-5/12' : 'block w-full  2xl:w-5/12'}`}>
            <div className={` h-full  shadow-lg ${background} rounded-lg overflow-hidden 2xl:max-w-lg w-full relative`}>
                <div className="md:flex">
                    <div className="w-full p-4 ">
                        <div className="relative"> <input type="text" className="w-full h-12 rounded focus:outline-none px-3 focus:shadow-md" placeholder="Search..." /> <i className="fa fa-search absolute right-3 top-4 text-gray-300" /> </div>
                        <ul>
                            {recent.map((chat) => {
                                return (
                                    <li className="flex justify-between items-center  mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition" onClick={() => handleRoomChange(chat)} key={chat._id}>
                                        <div className="flex ml-2">

                                            {chat.type === 'group' ? <img src="/group.jpeg" width={40} height={40} className="rounded-full" /> : <img src="/profile.png" width={40} height={40} className="rounded-full" />}


                                            <div className="flex flex-col ml-2">
                                                <span className="font-medium text-white">{
                                                    chat.type === 'group' ? chat.name : chat.members.filter((member: any) => member._id !== id)[0].name
                                                }</span>
                                                <span className="text-sm text-gray-400 truncate w-32">Hey, Joel, I here to help you out please tell me</span> </div>
                                        </div>
                                        {
                                            chat.notification?.count && <span className="inline-flex items-center justify-center w-8 h-8 ms-2 text-xs font-semibold  bg-green-600 rounded-full">  {chat.notification.count}
                                            </span>
                                        }



                                    </li>
                                )
                            })}


                        </ul>

                    </div>
                </div>
                <button
                    className="absolute bottom-4 right-4 w-12 h-12 bg-violet-700 text-white rounded-full flex items-center justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
            </div>
        </div>


    )
}

export default ChatList