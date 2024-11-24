
import React from 'react'

import ThemeButton from './Buttons/ThemeButton'
import Avathar from './Buttons/Avathar'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons/lib';

function Appbar({icons}:{icons:{
    icon: IconType;
    name: string;
    link: string;
}[]}) {
    const pathname = usePathname()
    const heading=icons.find(item => item.link === pathname)?.name || '';



    return (
        <div className='w-full border-b border-border  h-14 flex justify-between px-8 shadow-sm'>
            <div className='grid place-items-center'>
                <h1 className='text-2xl font-bold text-center'>{heading}</h1>
            </div>
            {/* <div className='flex items-center gap-3'>
                <div>
                    <ThemeButton />

                </div>
                <div className='w-8 h-8'>
                    <Avathar />
                </div>
            </div> */}
        </div>
    )
}

export default Appbar