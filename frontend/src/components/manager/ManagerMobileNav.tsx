"use client"
import React from 'react'
import { LuUsers } from "react-icons/lu";
import { FaLaptopCode } from "react-icons/fa";
import { PiBuildingsLight } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import MobileNavbar from '../common/MobileNavbar';


function ManagerMobileNav() {
    const icons = [
        {
            icon: RxDashboard,
            name: 'Dashboard',
            link: '/'
        },
        {
            icon: LuUsers,
            name: 'Users',
            link: ''
        },
        {
            icon: FaLaptopCode,
            name: 'Projects',
            link: ''
        },
        {
            icon: PiBuildingsLight,
            name: 'Branches',
            link: ''
        }
    ]
    return (
        // <></>
        <MobileNavbar icons={icons} />
    )
}

export default ManagerMobileNav