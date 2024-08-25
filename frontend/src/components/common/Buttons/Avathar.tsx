import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function Avathar() {
    return (
        <Avatar className='w-full h-full'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>

    )
}

export default Avathar