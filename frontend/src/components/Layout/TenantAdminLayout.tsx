"use client"
import React, { useState } from 'react';
import Header from '../Headers/Header';
import { useSelector } from 'react-redux';
import { ThemeState } from '@/features/theme/themeSlice';
import { RxDashboard } from 'react-icons/rx';
import Appbar from '../common/Appbar';
import { ScrollArea } from '../ui/scroll-area';
import MobileNavbar from '../common/MobileNavbar';
import { PiBuildings } from "react-icons/pi";
import { LuCrown, LuUsers } from 'react-icons/lu';
import { SiCashapp } from "react-icons/si";
import Sidebar from '../common/Sidebar';
import { MdAccountBalance } from "react-icons/md";
import { BsCash } from "react-icons/bs";

interface TenantAdminLayoutProps {
    children: React.ReactNode;
}

interface RootState {
    theme: ThemeState
}

const TenantAdminLayout: React.FC<TenantAdminLayoutProps> = ({ children }) => {
    const icons = [
        {
            icon: RxDashboard,
            name: 'Dashboard',
            link: '/dashboard'
        },
        {
            icon: PiBuildings,
            name: 'Branch',
            link: '/dashboard/branches'
        },
        {
            icon: LuUsers,
            name: 'User',
            link: '/dashboard/users'
        },
        {
            icon: LuCrown,
            name: 'Subscription',
            link: '/dashboard/subscription-details'
        },
        {
            icon: MdAccountBalance,
            name: 'Tenant',
            link: '/dashboard/tenant'
        },
        {
            icon: BsCash,
            name: 'Transactions',
            link: '/dashboard/transaction'
        }
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
export default TenantAdminLayout;
