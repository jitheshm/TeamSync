"use client";
import React from 'react'
import ProjectCard from './Cards/ProjectCard'
import { Pagination } from "@nextui-org/react";
import StatusCard from './Cards/StatusCard';
import MainButton from './Buttons/MainButton';
import { fetchAllProjects, fetchAllProjectsByPManager, fetchAllProjectsDeveloper, fetchAllProjectsTester, projectDelete, updateProjectStatus } from '@/api/projectService/project';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Input } from '../ui/input';
import { IProjects } from '@/interfaces/Project';
import ProjectSkelton from './ProjectSkelton';



function Projects({ role }: { role: string }) {

    const [projects, setProjects] = useState<IProjects[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(true)

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        let fetchProjects = null;

        if (role === 'Manager') {
            fetchProjects = fetchAllProjects;
        } else if (role === 'Project_Manager') {
            fetchProjects = fetchAllProjectsByPManager;
        } else if (role === 'Developer') {
            fetchProjects = fetchAllProjectsDeveloper;
        } else if (role === 'Tester') {
            fetchProjects = fetchAllProjectsTester;
        }

        fetchProjects && fetchProjects(search, page, limit).then((result: any) => {
            setProjects(result.data.data);
            setTotal(Number(result.data.totalCount));
            setLoading(false)
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
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleStatusChange = (projectId: string, newStatus: string) => {
        const data = {
            stage: newStatus
        };
        updateProjectStatus(data, projectId).then(() => {
            Swal.fire({
                title: "Updated!",
                text: "The project status has been updated.",
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
        <div className='p-8 w-full'>
            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-0 items-center justify-between'>
                <div className='font-extrabold'>
                    All Projects
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

                    {
                        !loading ? <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-1'>
                            {
                                projects.map((project, index) => (

                                    <ProjectCard key={project._id} data={project} handleDelete={handleDelete} role={role} />
                                ))
                            }

                        </div> :
                            <ProjectSkelton />
                    }

                    {
                        total > 0 && <div className='flex justify-center mt-2 h-1/6'>

                            <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" />
                        </div>
                    }
                </div>
                <div className='w-full mt-10 md:mt-0 lg:w-96 md:h-[calc(100vh-10rem)] border border-border'>
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

export default Projects