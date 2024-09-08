"use client"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Tooltip,
    Avatar,
    Pagination,
    Spinner
} from "@nextui-org/react";
import MoreButton from './Buttons/MoreButton';
import Link from 'next/link';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import randomColor from 'randomcolor';
import fontColorContrast from 'font-color-contrast';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/user/userSlice';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { SelectComponent } from './Buttons/Select';
import MainButton from './Buttons/MainButton';
import { Input } from '../ui/input';
import { fetchAllTaskTickets, ticketDelete, updateTicketStatus } from '@/api/projectService/project';
import { ITicket } from '@/interfaces/Ticket';


interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    branch_id: string;
    branch_location: string;
}

interface UserState {
    name: string;
    verified: boolean;
    tenantId: string;
    id: string;
}

interface RootState {
    user: UserState;
}


const TicketTable = ({ projectId, role, taskId }: { projectId: string; role: string; taskId: string }) => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [loading, setloading] = useState(true)
    const router = useRouter();
    const dispatch = useDispatch();
    const { confirm } = useAlertDialog();


    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        setloading(true)
        fetchAllTaskTickets(projectId, taskId, search, page, limit).then((result: any) => {
            setTickets(result.data.data);
            setTotal(result.data.totalCount);
            setloading(false)
        }).catch((err: any) => {
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    }, [toggle, search, page, limit]);

    const handleDelete = async (ticketId: string) => {
        const result = await confirm();
        if (result.isConfirm) {
            ticketDelete(ticketId, taskId, projectId).then(() => {
                setToggle(!toggle);
            }).catch((err: any) => {
                if (err.response.status === 401) {
                    dispatch(logout());
                    router.push('/employee/login');
                }
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleStatusChange = (ticketId: string, newStatus: string) => {
        const data = { status: newStatus };
        updateTicketStatus(data, projectId, taskId, ticketId).then(() => {

            setToggle(!toggle);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    };

    const options = [{
        name: 'Open',
        value: 'pending'
    }, {
        name: 'In Progress',
        value: 'in_progress'
    }, {
        name: 'Closed',
        value: 'closed'
    }
    ]


    return (
        <>
            <div className='px-5'>
                <div className='my-5  flex justify-between items-center'>
                    <p>
                        Ticket List
                    </p>
                    <div>
                        <Input placeholder='Search Users' onChange={(e) => setSearch(e.target.value)} value={search} />
                    </div>
                    <div>
                        {role === 'Project_Manager' && (
                            <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${taskId}/tickets/create`} className='w-full text-end md:w-auto'>
                                <MainButton name='Create New Ticket' />
                            </Link>)
                        }
                    </div>
                </div>
                <Table removeWrapper aria-label="Example static table with custom cells" className='bg-background md:p-10 rounded-lg md:border md:border-border'>
                    <TableHeader>
                        <TableColumn >Title</TableColumn>
                        <TableColumn >Created At</TableColumn>
                        <TableColumn >Status</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    {
                        !loading && tickets.length > 0 ? (
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
                                {tickets.map((ticket, index) => {
                                    const bgColor = randomColor();
                                    const textFont = fontColorContrast(bgColor);
                                    const initial = ticket.title.charAt(0).toUpperCase();
                                    return (
                                        <TableRow key={index}>
                                            <TableCell >
                                                <User
                                                    avatarProps={{
                                                        radius: "lg",
                                                        style: {
                                                            fontSize: "20px",
                                                            backgroundColor: bgColor,
                                                            color: textFont,
                                                            fontWeight: 'bold'
                                                        },
                                                        name: initial
                                                    }}

                                                    name={ticket.title}
                                                />

                                            </TableCell>
                                            <TableCell >
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell >
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">
                                                        <SelectComponent placeholder='Select a status' active={ticket?.status as string} options={options} handleValueChange={(value) => handleStatusChange(ticket?._id!, value)} />
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell >
                                                <div className="relative flex items-center justify-center gap-2">
                                                    <Tooltip content="Details">
                                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                            <MoreButton>
                                                                {
                                                                    role === 'Tester' ? <>
                                                                        <Link href={`/employee/tester/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}`}>
                                                                            <DropdownMenuItem>
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                        </Link>
                                                                        <Link href={`/employee/tester/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}/edit`}>
                                                                            <DropdownMenuItem>
                                                                                Edit
                                                                            </DropdownMenuItem>
                                                                        </Link>
                                                                        <DropdownMenuItem onClick={() => handleDelete(ticket._id)}>
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </> :
                                                                        <Link href={`/employee/developer/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}`}>
                                                                            <DropdownMenuItem>
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                        </Link>

                                                                }

                                                            </MoreButton>
                                                        </span>
                                                    </Tooltip>
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
}

export default TicketTable;
