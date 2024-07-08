"use client"
import { fetchSpecificProjectDetails } from '@/api/projectService/project';
import { IProjects } from '@/interfaces/Project';
import React, { useEffect, useState } from 'react';

const ProjectDetails = ({ projectId }: { projectId: string }) => {
    const [project, setProject] = useState<IProjects>();

    useEffect(() => {
        fetchSpecificProjectDetails(projectId).then((res) => {
            console.log(res.data);

            setProject(res.data);
        });
    }, [projectId]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 mt-5">Project Details</h1>
            <div className="bg-gray-800 shadow-md rounded mt-10 p-4">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-2">
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Project Name:</label>
                            <p className="w-2/3 text-gray-100">{project?.name}</p>
                        </div>

                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Client Name:</label>
                            <p className="w-2/3 text-gray-100">{project?.client_name}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Start Date:</label>
                            <p className="w-2/3 text-gray-100">{project?.start_date?.split('T')[0]}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">End Date:</label>
                            <p className="w-2/3 text-gray-100">{project?.end_date?.split('T')[0]}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Stage:</label>
                            <p className="w-2/3 text-gray-100">{project?.stage}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-2">

                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Project Manager :</label>
                            <p className="w-2/3 text-gray-100">{project?.project_manager[0]?.name}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Developers</label>
                            <ul className="w-2/3 list-disc list-inside text-gray-100">
                                {project?.developer.map((developer) => (
                                    <li key={developer._id}>{developer.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Testers:</label>
                            <p className="w-2/3 text-gray-100">{project?.tester.map((tester) => (
                                <li key={tester._id}>{tester.name}</li>
                            ))}</p>
                        </div>
                        {/* <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Branch ID:</label>
                            <p className="w-2/3 text-gray-100">{project?.branch_id}</p>
                        </div> */}
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Created At:</label>
                            <p className="w-2/3 text-gray-100">{project?.created_at && new Date(project.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-gray-800 shadow-md rounded mt-10 p-4 min-h-60'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Project Description</h1>
                <p className="text-gray-100">{project?.description}</p>
            </div>
        </div>
    );
};

export default ProjectDetails;
