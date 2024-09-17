"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import MeetingLanding from '@/components/common/MeetingLanding'

function Page() {

    const [roomId, setRoomId] = useState('')
    const router = useRouter()

    const handleListMeetings = () => {
        
        router.push(`/employee/project_manager/dashboard/meeting/list/schedule`)
    }

    const handleJoinRoom = () => {
        router.push(`/employee/project_manager/dashboard/meeting/${roomId}`)
    }
    const onRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value)
    }
    const handleScheduleMeeting = () => {
        router.push(`/employee/project_manager/dashboard/meeting/schedule`)
    }
    return (
        <MeetingLanding handleListMeetings={handleListMeetings} handleJoinRoom={handleJoinRoom} onRoomChange={onRoomChange} handleScheduleMeeting={handleScheduleMeeting} />
    )
}

export default Page