"use client"
import { fetchSpecificProjectDetails, fetchSpecificTaskDetails, updateProjectStatus, updateTaskStatus } from '@/api/projectService/project';
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
import { ITask } from '../TenantUserPanel/Tables/TaskTable';

const TaskDetails = ({ projectId, taskId, role }: { projectId: string, taskId: string, role: string }) => {

    const [toggle, setToggle] = useState<boolean>(true);
    const [task, setTask] = useState<ITask>();
    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchSpecificTaskDetails(projectId, taskId).then((res) => {
            console.log(res.data);

            setTask(res.data);
        });
    }, [projectId, taskId]);

    const options = [{
        name: 'Not Started',
        value: 'pending'
    }, {
        name: 'Testing',
        value: 'testing'
    }, {
        name: 'Completed',
        value: 'completed'
    }]

    const handleStatusChange = (taskId: string, newStatus: string) => {
        const data = {
            status: newStatus
        };
        updateTaskStatus(data, projectId, taskId).then(() => {
            setToggle(!toggle);
        }).catch((err: any) => {
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
                    Task Details
                </p>
                <div className='w-full md:w-auto flex justify-end'>
                    {
                        (role === 'Project_Manager' || role === 'Developer') && (<SelectComponent placeholder='Select a status' active={task?.status as string} options={options} handleValueChange={(value) => handleStatusChange(task?._id!, value)} />)
                    }

                </div>
            </div>
            <div className='border border-border p-5 rounded-lg'>
                <User
                    name={task?.title}

                    avatarProps={{
                        radius: "lg",
                        style: {
                            fontSize: "20px",
                            backgroundColor: bgColor,
                            color: textFont,
                            fontWeight: 'bold'
                        },
                        name: task?.title.charAt(0).toUpperCase()
                    }}
                />
            </div>
            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <div className='w-full  flex flex-wrap gap-5 lg:gap-0'>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Project Name</p>
                            <p>{task?.title}</p>
                        </div>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>End Date</p>
                            <p>{task?.due_date?.split('T')[0]}</p>
                        </div>

                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>


                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Stage</p>
                            <p>{task?.status}</p>
                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Developer </p>
                            <p className="w-2/3 text-gray-100">{task?.developer[0]?.name}</p>

                        </div>

                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5'>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Tester </p>
                            <p className="w-2/3 text-gray-100">{task?.tester[0]?.name}</p>

                        </div>

                    </div>

                </div>
            </div>

            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Task Description</h1>
                <p className="text-gray-100">{task?.description}</p>
            </div>

        </div>
    )
}

export default TaskDetails