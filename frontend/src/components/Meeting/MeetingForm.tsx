"use client"
import React from 'react'

interface MeetinfFormProps {
    handleListMeetings: () => void
    handleJoinRoom: () => void
    onRoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleScheduleMeeting: () => void
}

function MeetingForm({ handleListMeetings, handleJoinRoom, onRoomChange,handleScheduleMeeting }: MeetinfFormProps) {
    return (
        <div className=" bg-[url('/meeting.jpg')] bg-cover absolute top-0 left-0 w-screen h-screen">

            <div className='flex justify-center items-center absolute top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-35'>

                <div className="max-w-lg   flex flex-1 flex-wrap justify-center items-center gap-6 z-10" >
                    <input onChange={onRoomChange} type="text" className="py-3 px-4 block w-3/6/6 h-12 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-dark-100 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter Room Id" />
                    <button onClick={handleJoinRoom} type="button" className="text-white w-52 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ">Join Room</button>
                    <button onClick={handleListMeetings} type="button" className="text-white w-52 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2">Show Meetings</button>
                    <button onClick={handleScheduleMeeting} type="button" className="text-white w-52 bg-gradient-to-r from-green-300 via-gr-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2">Schedule Meeting</button>

                </div>
            </div>

        </div>
    )
}

export default MeetingForm