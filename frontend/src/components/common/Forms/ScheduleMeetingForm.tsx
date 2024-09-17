"use client";
import { scheduleMeeting } from '@/api/communicationService.ts/communication';
import { fetchTenantBranchUsers } from '@/api/userService/user';
import { Input } from '@/components/ui/input';
import { logout } from '@/features/user/userSlice';
import { Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';

const meetingSchema = z.object({
    meetingTitle: z.string().trim().min(3, 'Meeting title must be at least 3 characters long'),
    meetingDate: z.string().trim().min(1, 'Date is required'),
    meetingTime: z.string().trim().min(1, 'Time is required'),
    participants: z.array(z.string().trim()).min(1, 'At least one participant is required'),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

type Participant = {
    _id: string;
    name: string;
};

type FetchTenantBranchUsersResponse = {
    data: Participant[];
};

const ScheduleMeetingForm: React.FC<{ Homeurl: string }> = ({ Homeurl }) => {
    const [meetingTitle, setMeetingTitle] = useState<string>('');
    const [meetingDate, setMeetingDate] = useState<string>('');
    const [meetingTime, setMeetingTime] = useState<string>('');
    const [participants, setParticipants] = useState<string[]>([]);
    const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTenantBranchUsers()
            .then((result: FetchTenantBranchUsersResponse) => {
                setAvailableParticipants(result.data);
            })
            .catch((error: any) => {
                console.error('Error fetching participants:', error);
                if (error.response?.status === 401) {
                    dispatch(logout());
                    router.push('/employee/login');
                }
            });
    }, [dispatch, router]);

    const handleParticipantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedParticipants = e.target.value.split(',')
        setParticipants(selectedParticipants);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format

        if (meetingDate === currentDate && meetingTime < currentTime) {
            setErrors({ ...errors, meetingTime: 'Selected time is earlier than the current time.' });
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
            console.log(formData)
            setErrors({}); // Clear errors if validation passes
            scheduleMeeting(formData)
                .then(() => {
                    console.log("Meeting scheduled successfully");
                    router.push(Homeurl);
                })
                .catch((err: any) => {
                    console.error('Error scheduling meeting:', err);
                    if (err.response?.status === 401) {
                        dispatch(logout());
                        router.push('/employee/login');
                    }
                });
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);

    const filteredParticipants = availableParticipants.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex items-center w-full">
            <div className="w-full">
                <div className="sm:border border-border my-5 p-6 w-full rounded-lg shadow sm:w-3/4 mx-auto lg:w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Schedule a Meeting</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Meeting Title</label>
                            <Input
                                type="text"
                                value={meetingTitle}
                                onChange={(e) => setMeetingTitle(e.target.value)}
                                required
                            />
                            {errors.meetingTitle && <p className="text-red-500 text-sm">{errors.meetingTitle}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Participants</label>
                            <Select
                                selectionMode="multiple"
                                selectedKeys={participants}
                                id="participants"
                                name="participants"
                                placeholder='Select participants'
                                onChange={handleParticipantChange}
                                className=""
                                key={''}
                            >
                                {filteredParticipants.map((participant) => (
                                    <SelectItem key={participant._id}>{participant.name}</SelectItem>
                                ))}
                            </Select>
                            {errors.participants && <p className="text-red-500 text-sm">{errors.participants}</p>}
                        </div>

                        <div className="flex gap-5">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Date</label>
                                <Input
                                    type="date"
                                    value={meetingDate}
                                    className="w-fit"
                                    onChange={(e) => setMeetingDate(e.target.value)}
                                    required
                                    min={currentDate}
                                />
                                {errors.meetingDate && <p className="text-red-500 text-sm">{errors.meetingDate}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Time</label>
                                <Input
                                    type="time"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                    className="w-fit"
                                    required
                                    // min={currentTime}
                                />
                                {errors.meetingTime && <p className="text-red-500 text-sm">{errors.meetingTime}</p>}
                            </div>
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
        </div>
    );
};

export default ScheduleMeetingForm;
