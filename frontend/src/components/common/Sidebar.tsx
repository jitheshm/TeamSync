"use client"
import Image from 'next/image'
import React from 'react'
import MenuButton from './Buttons/MenuButton'
import { CiLogout } from "react-icons/ci";

import { IconType } from 'react-icons/lib';
import { Icon } from '@/interfaces/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { logout } from '@/features/user/userSlice';
import { logout as adminLogout } from '@/features/admin/adminSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'

function Sidebar({ icons }: { icons: Icon[] }) {

    const dispatch=useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(adminLogout())
        Cookies.remove('team-sync-token')
        localStorage.removeItem('team-sync-refresh-token');

    }

    return (
        <div className='h-screen border-r border-border w-20 pt-4 shadow-sm'>
            <div className='w-8 h-8 mx-auto '>
                <Image width={100} height={100} src="/logo.png" alt="" />

            </div>
            <div className='mt-10'>
                {
                    icons.map((ele) => {
                        return (
                            <div key={ele.name} className='mx-auto w-11 h-11 my-4'>
                                <MenuButton Icon={ele.icon} tooltip={ele.name} link={ele.link} />
                            </div>
                        )
                    })
                }

                <div className='mx-auto w-11 h-11 my-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`w-full h-full flex justify-center items-center rounded-xl  `} onClick={handleLogout}>
                                    <CiLogout/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Logout</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

            </div>

        </div>
    )
}

export default Sidebar