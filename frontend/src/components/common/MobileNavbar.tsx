"use client"
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import Avathar from './Buttons/Avathar'
import Link from 'next/link'
import MenuButtonMobile from './Buttons/MenuButtonMobile'

import ThemeButton from './Buttons/ThemeButton';
import { Icon } from '@/interfaces/Icon'

function MobileNavbar({ icons }: { icons: Icon[] }) {
    const [menuOption, setMenuOption] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOption(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className=' flex w-full border-b border-border h-14'>
                <div className='relative flex w-full'>
                    <div className='flex gap-4 m-auto '>
                        <div className='w-8 h-8'>
                            <Image width={100} height={100} src="/logo.png" alt="Logo" />
                        </div>
                        <div className='my-auto'>
                            <span>TeamSync</span>
                        </div>
                        <div className='absolute top-0 left-0 h-14 flex items-center px-6' onClick={() => setMenuOption(!menuOption)}>
                            <i className="lni lni-menu"></i>
                        </div>
                    </div>
                </div>
            </div>
             
                <div
                    ref={menuRef}
                    className={`fixed top-0 left-0 h-screen z-10 w-9/12 bg-secondarysurface rounded-tr-3xl shadow-xl transform transition-transform duration-300 ${menuOption ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className='flex gap-7 m-8'>
                        <div className='w-10 h-10 flex items-center'>
                            <Avathar />
                        </div>
                        <div className='flex flex-col'>
                            <span>Jithesh M</span>
                            <Link href={'/'} className='text-xs text-blue-700'>Update profile</Link>
                        </div>
                    </div>
                    <hr className='border-b-0 border-border mt-5' />
                    <div className='w-11/12 mx-auto p-5 flex flex-col gap-5'>
                        {
                            icons.map((ele) => {
                                return (

                                    <MenuButtonMobile key={ele.name} Icon={ele.icon} iconName={ele.name} link={ele.link} />

                                )
                            })
                        }

                    </div>
                    <hr className='border-b-0 border-border mt-5' />
                    <div className='w-11/12 mx-auto p-5 flex flex-col gap-5'>
                        <div className='flex items-center'>
                            <ThemeButton />
                        </div>
                    </div>
                </div>
            

        </>
    );
}

export default MobileNavbar;
