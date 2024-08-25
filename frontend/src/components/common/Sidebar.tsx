"use client"
import Image from 'next/image'
import React from 'react'
import MenuButton from './Buttons/MenuButton'

import { IconType } from 'react-icons/lib';
import { Icon } from '@/interfaces/Icon';

function Sidebar({ icons }: { icons: Icon[] }) {
    return (
        <div className='h-screen border-r border-border w-20 pt-4 shadow-sm'>
            <div className='w-8 h-8 mx-auto '>
                <Image width={100} height={100} src="/logo.png" alt="" />

            </div>
            <div className='mt-10'>
                {
                    icons.map((ele) => {
                        return (
                            <div key={ele.name} className='mx-auto w-11 h-11 my-2'>
                                <MenuButton Icon={ele.icon}  tooltip={ele.name} link={ele.link}/>
                            </div>
                        )
                    })
                }
               
                {/* <div className='mx-auto w-11 h-11 my-2'>
                    <MenuButton Icon={LuUsers} bgColor='bg-selectionbackground' textColor='text-selectiontext' tooltip='Dashboard' />
                </div> */}
                
            </div>

        </div>
    )
}

export default Sidebar