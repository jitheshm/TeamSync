"use client";

import { fetchAllTaskTickets, ticketDelete, updateTicketStatus } from '@/api/projectService/project';
import Empty from '@/components/Empty/Empty';
import { ThemeState } from '@/features/theme/themeSlice';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export interface ITicket {
    _id: string;
    title: string;
    status: string;
    projects: {
        _id: string;
        name: string;
    };
    tasks: {
        _id: string;
        title: string;
    };
    description: string;
    created_at: string;
    developer: [
        {
            name: string;
        }
    ];
    tester: [
        {
            name: string;
        }
    ];
    upload_images:[]

}

interface UserState {
    name: string;
    verified: boolean;
    tenantId: string;
    id: string;
}

interface RootState {
    user: UserState;
    theme: ThemeState;
}

const TicketTable = ({ projectId, role, taskId }: { projectId: string; role: string; taskId: string }) => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const { id, verified } = useSelector((state: RootState) => state.user);
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        fetchAllTaskTickets(projectId, taskId, search, page, limit).then((result: any) => {
            setTickets(result.data.data);
            setTotal(result.data.totalCount);
        }).catch((err: any) => {
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    }, [toggle, search, page, limit]);

    const handleDelete = (ticketId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                ticketDelete(ticketId, taskId, projectId).then(() => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The ticket has been deleted.",
                        icon: "success"
                    });
                    setToggle(!toggle);
                }).catch((err: any) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/employee/login');
                    }
                });
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleStatusChange = (ticketId: string, newStatus: string) => {
        const data = { status: newStatus };
        updateTicketStatus(data, projectId, taskId, ticketId).then(() => {
            Swal.fire({
                title: "Updated!",
                text: "The ticket status has been updated.",
                icon: "success"
            });
            setToggle(!toggle);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    };

    return (
        <div className="w-11/12 mb-8 mt-6 overflow-hidden rounded-lg">
            <h1 className={`font-semibold text-xl my-8 py-2 text-center  bg-violet-800 rounded-lg flex w-full px-14 bg-gray-100`}>
                Ticket List
            </h1>
            <div className='mb-8'>
                <form className="max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className={`block w-full p-4 ps-10 text-sm ${dark ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white' : 'text-gray-900 border border-gray-300 bg-gray-50'} rounded-lg`} placeholder="Search Tickets" onChange={(e) => setSearch(e.target.value)} value={search} required />
                    </div>
                </form>
                <div className="lg:ml-40 ml-10 space-x-8">
                    {role === 'Project_Manager' && (
                        <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${taskId}/tickets/create`} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                            Create Ticket
                        </Link>
                    )}
                </div>
            </div>
            <div className="w-full overflow-x-auto shadow-lg">
                <table className="min-w-[70rem] w-full whitespace-no-wrap">
                    <thead>
                        <tr className={`text-lg font-semibold tracking-wide text-left shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                            <th className="px-4 py-3 text-center">Title</th>
                            <th className="px-4 py-3 text-center">Created At</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y  divide-gray-600 ${!dark ? 'bg-gray-100 text-gray-950 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-center">{ticket.title}</td>
                                    <td className="px-4 py-3 text-center">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <select
                                            className={` ${dark ? 'text-gray-100' : 'text-gray-950'} bg-transparent hover:bg-green-600 focus:ring-1 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center border border-green-600`}
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        {
                                            role === 'Tester' ? (
                                                <>
                                                    <Link href={`/employee/tester/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>
                                                    <Link href={`/employee/tester/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>
                                                    <button type="button" onClick={() => handleDelete(ticket._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                                </>) :
                                                <>
                                                    <Link href={`/employee/developer/dashboard/projects/${ticket.projects._id}/tasks/${ticket.tasks._id}/tickets/${ticket._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>

                                                </>

                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-3 text-center">
                                    <Empty />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className={`grid px-4 py-3 min-w-[70rem] w-full  text-xs font-semibold tracking-wide shadow   uppercase  ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : "bg-[#1A1C23] text-gray-300 border-t border-gray-700"} sm:grid-cols-9 `}>
                    <span className="flex items-center col-span-3">
                        Showing {page} of {Math.ceil(total / limit)} pages
                    </span>
                    <div className="col-span-4"></div>
                    <span className="flex col-span-2 mt-2 sm:mt-auto sm:justify-end">
                        <nav aria-label="Table navigation">
                            <ul className="inline-flex items-center">
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:ring"
                                        aria-label="Previous"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                    >
                                        <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                            <path d="M7.05 10l4.95-4.95-1.41-1.41L3.24 10l7.34 7.36 1.41-1.41L7.05 10z"></path>
                                        </svg>
                                    </button>
                                </li>
                                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                                    <li key={i}>
                                        <button
                                            className={`px-3 py-1 rounded-md ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-400'} focus:outline-none focus:ring`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:ring"
                                        aria-label="Next"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === Math.ceil(total / limit)}
                                    >
                                        <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                            <path d="M12.95 10l-4.95 4.95 1.41 1.41L16.76 10l-7.34-7.36-1.41 1.41L12.95 10z"></path>
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketTable;
