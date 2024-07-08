"use client";
import { fetchAllProjects, fetchAllProjectsByPManager, projectDelete } from '@/api/projectService/project';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export interface IProject {
    _id: string;
    project_id: string;
    name: string;
    client_name: string;
    stage: string;
    end_date: string;
}

const ProjectTable = ({ role }: { role: string }) => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        const fetchProjects = role === 'Manager' ? fetchAllProjects : fetchAllProjectsByPManager;
        fetchProjects(search, page, limit).then((result: any) => {
            setProjects(result.data.data);
            setTotal(result.data.total);
        }).catch((err: any) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    }, [toggle, search, page, limit]);

    const handleDelete = (projectId: string) => {
        if (role === 'Manager') {
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
                    projectDelete(projectId).then(() => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The project has been deleted.",
                            icon: "success"
                        });
                        setToggle(!toggle);
                    }).catch((err) => {
                        if (err.response.status === 401) {
                            dispatch(logout());
                            router.push('/employee/login');
                        }
                    });
                }
            });
        }
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    return (
        <div className="p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Projects</h2>
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
                        {role === 'Manager' && (
                            <Link href={'/employee/manager/dashboard/projects/create'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
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
                            <div className='col-span-2'>Project Name</div>
                            <div className='col-span-2'>Client Name</div>
                            <div className='col-span-2'>Stage</div>
                            <div className='col-span-2'>End Date</div>
                            <div className='col-span-2'>Actions</div>
                        </div>
                        {projects?.length > 0 ? (
                            projects.map((project, index) => (
                                <div key={index} className="bg-gray-700 p-6 rounded-lg text-center justify-stretch shadow-lg grid grid-cols-10">
                                    <div className='col-span-2'>
                                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className="text-white">{project.client_name}</p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className="text-white">{project.stage}</p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className="text-white">{new Date(project.end_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex col-span-2 space-x-2">
                                        {role === 'Manager' ? (
                                            <>
                                                <Link href={`/employee/manager/dashboard/projects/${project._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>
                                                <Link href={`/employee/manager/dashboard/projects/${project._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>
                                                <button type="button" onClick={() => handleDelete(project._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={`/employee/project_manager/dashboard/projects/${project._id}`} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View</Link>
                                                <Link href={`/employee/project_manager/dashboard/projects/${project._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create Task</Link>
                                                <Link href={`/employee/project_manager/dashboard/projects/${project._id}`} className="focus:outline-none text-white bg-blue-500 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-500 dark:focus:ring-blue-500">Show Task</Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
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
                        className="mx-1 px-3 py-1 bg-gray-600 text-white rounded-lg"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2 text-gray-100">Page {page} of {Math.ceil(total / limit)}</span>
                    <button
                        className="mx-1 px-3 py-1 bg-gray-600 text-white rounded-lg"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= Math.ceil(total / limit)}
                    >
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

export default ProjectTable;
