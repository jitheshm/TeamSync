import Meeting from '@/components/Meeting/Meeting'
import React from 'react'

function page({ params }: { params: { roomId: string } }) {
    return (
        <Meeting roomId={params.roomId}/>
    )
}

export default page