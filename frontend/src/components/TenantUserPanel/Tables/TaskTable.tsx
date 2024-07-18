"use client";

import { fetchAllTasks, taskDelete, updateTaskStatus } from '@/api/projectService/project';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export interface ITask {
    _id: string;
    title: string;
    developer: { name: string }[];
    tester: { name: string }[];
    status: string;
    description: string
    due_date: string
}

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    id: string
}

interface RootState {
    user: UserState
}

const TaskTable = ({ projectId, role }: { projectId: string, role: string }) => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const { id, verified } = useSelector((state: RootState) => state.user)


    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        fetchAllTasks(projectId, search, page, limit).then((result: any) => {
            setTasks(result.data.data);
            setTotal(result.data.total);
        }).catch((err: any) => {
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    }, [toggle, search, page, limit]);

    const handleDelete = (taskId: string) => {
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
                taskDelete(taskId, projectId).then(() => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The task has been deleted.",
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
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    const handleStatusChange = (taskId: string, newStatus: string) => {
        const data = {
            status: newStatus
        }
        updateTaskStatus(data, projectId, taskId).then(() => {
            Swal.fire({
                title: "Updated!",
                text: "The task status has been updated.",
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
        <div className="p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Tasks</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            className="bg-gray-50 outline-none text-gray-950 ml-1 block"
                            type="text"
                            name="search"
                            id="search"
                            placeholder="search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        {role === 'Project_Manager' && (
                            <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/create`} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                Create
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className=''>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-10 text-center font-semibold text-white">
                            <div className='col-span-2'>Task Name</div>
                            <div className='col-span-2'>Developer Name</div>
                            <div className='col-span-2'>Tester Name</div>
                            <div className='col-span-2'>Status</div>
                            <div className='col-span-2'>Actions</div>
                        </div>
                        {tasks?.length > 0 ? (
                            tasks.map((task, index) => {
                                if (role === 'Developer') {
                                    if (task.developer[0]._id != id) {
                                        return
                                    }
                                } else if (role === 'Tester') {
                                    if (task.tester[0]._id != id) {
                                        return
                                    }
                                }

                                return (
                                    <div key={index} className="bg-gray-700 p-6 rounded-lg text-center justify-stretch shadow-lg grid grid-cols-10">
                                        <div className='col-span-2'>
                                            <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                                        </div>
                                        <div className='col-span-2'>
                                            <p className="text-white">{task.developer[0].name}</p>
                                        </div>
                                        <div className='col-span-2'>
                                            <p className="text-white">{task.tester[0].name}</p>
                                        </div>
                                        {
                                            role === 'Tester' ?
                                                <div className='col-span-2'>
                                                    <select
                                                        className="text-gray-100 bg-transparent hover:bg-green-600 focus:ring-1 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center border border-green-600 dark:text-gray-100 dark:hover:bg-green-600 dark:focus:ring-green-600"
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                    >

                                                        <option value="testing">Testing</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>
                                                :

                                                <div className='col-span-2'>
                                                    <select
                                                        className="text-gray-100 bg-transparent hover:bg-green-600 focus:ring-1 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center border border-green-600 dark:text-gray-100 dark:hover:bg-green-600 dark:focus:ring-green-600"
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="testing">Testing</option>
                                                    </select>
                                                </div>
                                        }
                                        <div className="flex col-span-2 space-x-2 justify-center">
                                            {role === 'Project_Manager' ? (
                                                <>
                                                    <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${task._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>
                                                    <Link href={`/employee/project_manager/dashboard/projects/${projectId}/tasks/${task._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>
                                                    <button type="button" onClick={() => handleDelete(task._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                                </>
                                            ) :role==='Developer' ?(
                                                <Link href={`/employee/developer/dashboard/projects/${projectId}/tasks/${task._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>
                                            ):
                                            <Link href={`/employee/tester/dashboard/projects/${projectId}/tasks/${task._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>

                                        }
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <Empty />
                        )}
                    </div>
                </div>
            </div>
            {
                total > limit &&
                <div className="flex justify-center mt-4">
                    <button
                        className="mx-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                        <button
                            key={i}
                            className={`mx-1 px-3 py-1 ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-lg hover:bg-gray-400`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="mx-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === Math.ceil(total / limit)}
                    >
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

export default TaskTable;
