"use client";

import { fetchMeeting } from '@/api/communicationService.ts/communication';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation'
import { Input } from '../ui/input';
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import MainButton from './Buttons/MainButton';

export interface IMeeting {
    _id: string;
    meetingTitle: string;
    meetingDate: string;
    meetingTime: string;
    meetingLink: string;

}

interface UserState {
    name: string;
    verified: boolean;
    tenantId: string;
    id: string;
}



const MeetingTable = () => {
    const [loading, setLoading] = useState(true)
    const [meetings, setMeeting] = useState<IMeeting[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const path = usePathname();

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        setLoading(true)
        fetchMeeting(search, page, limit).then((res) => {
            setMeeting(res.data);
            setTotal(res.total);
            setLoading(false)
        }).catch((err) => {
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        })
    }, [toggle, search, page, limit]);



    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const url = path.replace(/\/list\/schedule$/, '');



    return (
        <>
            <div className='p-5'>
                <div className='my-5 flex justify-between items-center'>
                    <p>
                        All Meetings
                    </p>
                    <div>
                        <Input placeholder='Search Meeting' onChange={(e) => setSearch(e.target.value)} value={search} />
                    </div>

                </div>
                <Table removeWrapper aria-label="Example static table with custom cells" className='bg-background md:p-10 rounded-lg md:border md:border-border'>
                    <TableHeader>
                        <TableColumn >No</TableColumn>
                        <TableColumn >Title</TableColumn>
                        <TableColumn >Date</TableColumn>
                        <TableColumn >Time</TableColumn>
                        <TableColumn align="center">Link</TableColumn>
                    </TableHeader>
                    {
                        !loading && meetings.length > 0 ? (
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
                                {meetings.map((meeting, index) => {

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {page*10-10+index + 1}
                                            </TableCell>
                                            <TableCell >
                                                {meeting.meetingTitle}
                                            </TableCell>
                                            <TableCell >
                                                {new Date(meeting.meetingDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell >
                                                {meeting.meetingTime}
                                            </TableCell>

                                            <TableCell >
                                                <div className="relative flex items-center justify-center gap-2">
                                                    <Link href={`${url}/${meeting.meetingLink}`}>
                                                        <MainButton name='Join here' />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        ) :
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />} emptyContent={"No data found."}>{[]}</TableBody>
                    }
                </Table>
                {
                    !loading && total > 0 && <div className='flex justify-center mt-2 h-1/6'>

                        <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" onChange={handlePageChange} />
                    </div>
                }
            </div>
        </>
    );
};

export default MeetingTable;
