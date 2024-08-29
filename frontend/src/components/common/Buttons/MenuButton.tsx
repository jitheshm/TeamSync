"use client"
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconType } from 'react-icons/lib'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


function MenuButton({ Icon, tooltip, link }: { Icon: IconType, tooltip: string, link: string }) {
    const pathname=usePathname()
    return (


        <Link href={link}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={`w-full h-full flex justify-center items-center rounded-xl ${tooltip!='Dashboard' ? pathname.startsWith(link) ? 'bg-primary text-text-white' : 'text-textcolor': pathname===link? 'bg-primary text-text-white' : 'text-textcolor'}  `}>
                            <Icon size={20} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Link>



    )
}

export default MenuButton