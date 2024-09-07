"use client";
import React from 'react'
import ProjectCard from './Cards/ProjectCard'
import { Pagination } from "@nextui-org/react";
import StatusCard from './Cards/StatusCard';
import MainButton from './Buttons/MainButton';
import { fetchAllProjects, fetchAllProjectsByPManager, fetchAllProjectsDeveloper, fetchAllProjectsTester, fetchAllTasks, projectDelete, taskDelete, updateProjectStatus, updateTaskStatus } from '@/api/projectService/project';
import Empty from '@/components/common/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Input } from '../ui/input';
import { IProjects } from '@/interfaces/Project';
import ProjectSkelton from './ProjectSkelton';
import { ITask } from '@/interfaces/Task';
import TaskCard from './Cards/TaskCard';



function Task({ projectId, role }: { projectId: string, role: string }) {

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        setLoading(true)
        fetchAllTasks(projectId, search, page, limit).then((result: any) => {
            setTasks(result.data.data);
            setTotal(result.data.totalCount);
            setLoading(false)
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
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleStatusChange = (taskId: string, newStatus: string) => {
        const data = {
            status: newStatus
        };
        updateTaskStatus(data, projectId, taskId).then(() => {
            Swal.fire({
                title: "Updated!",
                text: "The task status has been updated.",
                icon: "success"
            });
            setToggle(!toggle);
        }).catch((err: any) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    };

    return (
        <div className='p-8 w-full'>
            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-0 items-center justify-between'>
                <div className='font-extrabold'>
                    All Tasks
                </div>
                <div>
                    <Input placeholder='Search Projects' onChange={(e) => setSearch(e.target.value)} value={search} />
                </div>

                {
                    role === 'Manager' && (
                        <Link href={'/employee/manager/dashboard/projects/create'} className='w-full text-end md:w-auto'>
                            <MainButton name='New Project' />
                        </Link>)
                }

            </div>
            <div className='flex mt-4 sm:gap-2 flex-wrap lg:flex-nowrap '>

                <div className='md:min-h-[calc(100vh-10rem)] md:px-10 md:pt-10 md:border border-border w-full'>

                    <div className='h-5/6'>
                        {
                            !loading ?
                                tasks.length > 0 ?
                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-1'>
                                        {
                                            tasks.map((task, index) => (

                                                <TaskCard key={task._id} data={task} handleDelete={handleDelete} role={role} projectId={projectId} />
                                            ))
                                        }

                                    </div> :
                                    <Empty />
                                :
                                <ProjectSkelton />
                        }
                    </div>

                    {
                        !loading && total > 0 && <div className='flex justify-center mt-2 h-1/6'>

                            <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" onChange={handlePageChange} />
                        </div>
                    }
                </div>
                <div className='w-full mt-10 mb-10 md:mb-0 md:mt-0 lg:w-96 md:h-[calc(100vh-10rem)] border border-border'>
                    <div className='font-semibold text-center mt-5'>
                        On Going Projects
                    </div>

                    <div className='mt-5'>
                        <StatusCard />
                        <StatusCard />
                        <StatusCard />
                        <StatusCard />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Task