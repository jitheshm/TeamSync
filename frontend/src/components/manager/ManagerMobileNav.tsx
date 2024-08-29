"use client"
import React from 'react'
import MobileNavbar from '../common/MobileNavbar';
import { IconType } from 'react-icons/lib';


function ManagerMobileNav({ icons }: {
    icons: {
      icon: IconType;
      name: string;
      link: string;
    }[]
  }) {
    
    return (
        // <></>
        <MobileNavbar icons={icons} />
    )
}

export default ManagerMobileNav