"use client"
import React, { useState } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaLaptopCode } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline, IoVideocamOutline } from 'react-icons/io5';
import Sidebar from '../common/Sidebar';
import Appbar from '../common/Appbar';
import { ScrollArea } from '../ui/scroll-area';
import MobileNavbar from '../common/MobileNavbar';

interface TenantDeveloperLayoutProps {
    children: React.ReactNode;
}


const TenantDeveloperLayout: React.FC<TenantDeveloperLayoutProps> = ({ children }) => {

    const icons = [
        {
            icon: RxDashboard,
            name: 'Dashboard',
            link: '/employee/developer/dashboard'
        },
        {
            icon: FaLaptopCode,
            name: 'Projects',
            link: '/employee/developer/dashboard/projects'
        },
        {
            icon: IoChatbubbleEllipsesOutline,
            name: 'Chats',
            link: '/employee/developer/dashboard/chats'
        },
        {
            icon: IoVideocamOutline,
            name: 'Meeting',
            link: '/employee/developer/dashboard/meeting'
        },
        // {
        //   icon: SlNote,
        //   name: 'Todo',
        //   link:'/employee/manager/dashboard/todo'
        // }
    ]

    return (
        <>
            <div className="md:flex hidden ">
                <Sidebar icons={icons} />
                <div className="w-full">
                    <Appbar icons={icons} />
                    <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                        {/* body goes here */}
                        {children}
                    </ScrollArea>
                </div>
            </div>
            <div className="md:hidden">
                <MobileNavbar icons={icons} />
                <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                    {/* body goes here */}
                    {children}
                </ScrollArea>

            </div>
        </>
    );
};

export default TenantDeveloperLayout;
