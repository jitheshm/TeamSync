"use client"
import { fetchSpecificProjectDetails, updateProjectStatus } from '@/api/projectService/project';
import { IProjects } from '@/interfaces/Project';
import { User } from '@nextui-org/react';
import fontColorContrast from 'font-color-contrast';
import randomColor from 'randomcolor';
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { SelectComponent } from './Buttons/Select';
import { logout } from '@/features/user/userSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

function ProjectDetails({ projectId, role }: { projectId: string, role: string }) {

    const [toggle, setToggle] = useState<boolean>(true);
    const [project, setProject] = useState<IProjects>();
    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchSpecificProjectDetails(projectId).then((res) => {
            console.log(res.data);

            setProject(res.data);
        });
    }, [projectId, toggle]);

    const options = [{
        name: 'Not Started',
        value: 'pending'
    }, {
        name: 'In Progress',
        value: 'development'
    }, {
        name: 'Completed',
        value: 'completed'
    }
    ]

    const handleStatusChange = (projectId: string, newStatus: string) => {
        const data = {
            stage: newStatus
        };
        updateProjectStatus(data, projectId).then(() => {
            setToggle(!toggle);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    };

    return (
        <div className='md:px-16 p-4'>
            <div className='my-5 flex flex-wrap justify-between'>
                <p className='w-full md:w-auto'>
                    Project Details
                </p>
                <div className='w-full md:w-auto flex justify-end'>
                    {
                        (role === 'Project_Manager'||role==='Manager') && (<SelectComponent placeholder='Select a status' active={project?.stage as string} options={options} handleValueChange={(value) => handleStatusChange(project?._id!, value)} />)
                    }

                </div>
            </div>
            <div className='border border-border p-5 rounded-lg'>
                <User
                    name={project?.name}
                    description={project?.client_name}
                    avatarProps={{
                        radius: "lg",
                        style: {
                            fontSize: "20px",
                            backgroundColor: bgColor,
                            color: textFont,
                            fontWeight: 'bold'
                        },
                        name: project?.name.charAt(0).toUpperCase()
                    }}
                />
            </div>
            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <div className='w-full  flex flex-wrap gap-5 lg:gap-0'>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Project Name</p>
                            <p>{project?.name}</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Client Name</p>
                            <p>{project?.client_name}</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Start Date</p>
                            <p>{project?.start_date?.split('T')[0]}</p>
                        </div>

                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>End Date</p>
                            <p>{project?.end_date?.split('T')[0]}</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Stage</p>
                            <p>{project?.stage}</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Project Manager </p>
                            <p>{project?.project_manager[0]?.name}</p>
                        </div>
                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5'>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Created At </p>
                            <p>{project?.created_at && new Date(project.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className='mt-2'>
                                    <Button variant="outline">Developers List</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    {project?.developer.map((developer) => (
                                        <div key={developer._id} className="text-sm">{developer.name}</div>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className='mt-2'>
                                    <Button variant="outline">Testers List</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    {project?.tester.map((tester) => (
                                        <div key={tester._id} className="text-sm">{tester.name}</div>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                </div>
            </div>

            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Project Description</h1>
                <p className="text-gray-100">{project?.description}</p>
            </div>

        </div>
    )
}

export default ProjectDetails