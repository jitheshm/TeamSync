"use client"
import { fetchSpecificProjectDetails, fetchSpecificTaskDetails } from '@/api/projectService/project';
import { IProjects } from '@/interfaces/Project';
import React, { useEffect, useState } from 'react';
import { ITask } from '../Tables/TaskTable';

const TaskDetails = ({ projectId, taskId }: { projectId: string, taskId: string }) => {
    const [task, setTask] = useState<ITask>();

    useEffect(() => {
        fetchSpecificTaskDetails(projectId, taskId).then((res) => {
            console.log(res.data);

            setTask(res.data);
        });
    }, [projectId, taskId]);

    return (
        <div className="container mx-auto p-4 mt-10">
            <h1 className="text-2xl font-bold mb-4 mt-5">Task Details</h1>
            <div className="bg-gray-700 shadow-md rounded mt-10 p-4">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-2">
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Task Name:</label>
                            <p className="w-2/3 text-gray-100">{task?.title}</p>
                        </div>

                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Due Date:</label>
                            <p className="w-2/3 text-gray-100">{task?.due_date && new Date(task?.due_date).toLocaleString()}</p>
                        </div>


                    </div>
                    <div className="w-full md:w-1/2 px-2">


                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Developers</label>
                            <p className="w-2/3 text-gray-100">{task?.developer[0]?.name}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Testers:</label>
                            <p className="w-2/3 text-gray-100">{task?.tester[0]?.name}</p>
                        </div>


                    </div>
                </div>
            </div>
            <div className='bg-gray-700 shadow-md rounded mt-10 p-4 min-h-60'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Task Description</h1>
                <p className="text-gray-100">{task?.description}</p>
            </div>
        </div>
    );
};

export default TaskDetails;
