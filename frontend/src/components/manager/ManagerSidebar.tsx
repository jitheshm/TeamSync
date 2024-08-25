"use client"
import React from 'react'
import Sidebar from '../common/Sidebar'
import { IconType } from 'react-icons/lib';


function ManagerSidebar({ icons }: {
  icons: {
    icon: IconType;
    name: string;
    link: string;
  }[]
}) {

  return (
    <Sidebar icons={icons} />
  )
}

export default ManagerSidebar