"use client"
import React, { useState } from 'react';
import Header from '../Headers/Header';
import Sidebar from '../Sidebars/TenantManagerSidebar';
import { useSelector } from 'react-redux';
import { ThemeState } from '@/features/theme/themeSlice';
import ManagerSidebar from '../manager/ManagerSidebar';
import Appbar from '../common/Appbar';
import { ScrollArea } from '../ui/scroll-area';
import ManagerMobileNav from '../manager/ManagerMobileNav';
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { FaLaptopCode } from "react-icons/fa";
import { PiBuildingsLight } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { SlNote } from "react-icons/sl";

interface TenantManagerLayoutProps {
    children: React.ReactNode;
}



const TenantManagerLayout: React.FC<TenantManagerLayoutProps> = ({ children }) => {

    const icons = [
        {
          icon: RxDashboard,
          name: 'Dashboard',
          link:'/employee/manager/dashboard'
        },
        {
          icon: LuUsers,
          name: 'Users',
          link:'/employee/manager/dashboard/users'
        },
        {
          icon: FaLaptopCode,
          name: 'Projects',
          link:'/employee/manager/dashboard/projects'
        },
        {
          icon: IoChatbubbleEllipsesOutline,
          name: 'Chats',
          link:'/employee/manager/dashboard/chats'
        },
        {
          icon: IoVideocamOutline,
          name: 'Meeting',
          link:'/employee/manager/dashboard/meeting'
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
                <ManagerSidebar icons={icons}/>
                <div className="w-full">
                    <Appbar icons={icons}/>
                    <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                        {/* body goes here */}
                        {children}
                    </ScrollArea>
                </div>
            </div>
            <div className="md:hidden">
                <ManagerMobileNav icons={icons}/>
                <ScrollArea className="h-[calc(100vh-3.5rem)] ">
                        {/* body goes here */}
                        {children}
                    </ScrollArea>

            </div>
        </>
    );
};

export default TenantManagerLayout;
