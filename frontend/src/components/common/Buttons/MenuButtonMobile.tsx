
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { IconType } from 'react-icons/lib'

function MenuButtonMobile({ Icon, iconName,link }: { Icon: IconType, iconName: string, link: string }) {
    const pathname=usePathname()
    return (
        <Link href={link}>
            <div className={`flex gap-4 p-2 rounded-lg items-center ${pathname === link ? 'bg-primary text-primary-foreground' : 'text-textcolor'}`}>
                <Icon size={18} />
                <p>
                    {iconName}
                </p>
            </div>
        </Link>
    )
}

export default MenuButtonMobile