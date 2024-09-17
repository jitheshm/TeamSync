import MeetingUI from '@/components/common/MeetingUI'
import React from 'react'

function page({ params }: { params: { roomId: string } }) {
    return (
        <MeetingUI roomId={params.roomId} />
    )
}

export default page