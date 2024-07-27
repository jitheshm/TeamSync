"use client";
import { fetchTenantBranchUsers } from '@/api/userService/user';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { z, ZodError } from 'zod';

// Define Zod schema for validation
const meetingSchema = z.object({
    meetingTitle: z.string().min(3, 'Meeting title is required'),
    meetingDate: z.string().min(1, 'Date is required'),
    meetingTime: z.string().min(1, 'Time is required'),
    participants: z.array(z.string()).min(1, 'At least one participant is required'),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

// Define type for available participants
type Participant = {
    _id: string;
    name: string;
};

const ScheduleMeetingForm: React.FC = () => {
    const [meetingTitle, setMeetingTitle] = useState<string>('');
    const [meetingDate, setMeetingDate] = useState<string>('');
    const [meetingTime, setMeetingTime] = useState<string>('');
    const [participants, setParticipants] = useState<string[]>([]);
    const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetchTenantBranchUsers().then((result) => {
            setAvailableParticipants(result.data.map((ele: any) => ({
                _id: ele._id,
                name: ele.name,
            })));
        }).catch((error) => {
            console.error('Error fetching participants:', error);
        });
    }, []);

    const handleParticipantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { options } = e.target;
        const selectedParticipants: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedParticipants.push(options[i].value);
            }
        }
        setParticipants(selectedParticipants);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate meeting date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format

        if (meetingDate === currentDate && meetingTime < currentTime) {
            console.error('Selected time is earlier than the current time.');
            return;
        }

        const formData: MeetingFormValues = {
            meetingTitle,
            meetingDate,
            meetingTime,
            participants,
        };

        try {
            meetingSchema.parse(formData);
            // Handle form submission here
            console.log('Meeting scheduled:', formData);
        } catch (error) {
            if (error instanceof ZodError) {
                console.error('Validation errors:', error.errors);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format

    // Filter participants based on the search term
    const filteredParticipants = availableParticipants.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-8/12 h-fit mx-auto text-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Schedule a Meeting</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Meeting Title</label>
                        <input
                            type="text"
                            value={meetingTitle}
                            onChange={(e) => setMeetingTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <input
                            type="date"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                            required
                            min={currentDate}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <input
                            type="time"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                            required
                            min={currentTime}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Participants</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search participants"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-2"
                        />
                        <select
                            multiple
                            value={participants}
                            onChange={handleParticipantChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                            size={4}
                        >
                            {filteredParticipants.map((participant) => (
                                <option key={participant._id} value={participant._id}>
                                    {participant.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Schedule Meeting
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingForm;
