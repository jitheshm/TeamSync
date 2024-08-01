"use client"
import MeetingForm from '@/components/Meeting/MeetingForm'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'

function Page() {

    const [roomId, setRoomId] = useState('')
    const router = useRouter()

    const handleCreateRoom = () => {
        const roomId = nanoid()
        router.push(`/employee/project_manager/dashboard/meeting/${roomId}`)
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
        <MeetingForm handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom} onRoomChange={onRoomChange} handleScheduleMeeting={handleScheduleMeeting} />
    )
}

export default Page