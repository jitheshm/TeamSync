
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { IconType } from 'react-icons/lib'

function MenuButtonMobile({ Icon, iconName,link }: { Icon: IconType, iconName: string, link: string }) {
    const pathname=usePathname()
    useEffect(() => {
      
        console.log(pathname,link);
        
    }, [link])
    
    return (
        <Link href={link}>
            <div className={`flex gap-4 p-2 rounded-lg items-center ${iconName!='Dashboard' ? pathname.startsWith(link) ? 'bg-primary text-text-white' : 'text-textcolor': pathname===link? 'bg-primary text-text-white' : 'text-textcolor'}`}>
                <Icon size={18} />
                <p>
                    {iconName}
                </p>
            </div>
        </Link>
    )
}

export default MenuButtonMobile