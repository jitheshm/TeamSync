/* eslint-disable @next/next/no-img-element */
"use client"
import { fetchSpecificTicketDetails } from '@/api/projectService/project';
import React, { useEffect, useState } from 'react';
import { ITicket } from '../Tables/TicketTable';
import { IMAGEURL } from '@/constants/constant';

const TicketDetails = ({ projectId, taskId, ticketId }: { projectId: string, taskId: string, ticketId: string }) => {
    const [ticket, setTicket] = useState<ITicket>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchSpecificTicketDetails(projectId, taskId, ticketId).then((res) => {
            console.log(res.data);
            setTicket(res.data);
        });
    }, [projectId, taskId, ticketId]);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    return (
        <div className="container mx-auto p-4 mt-10">
            <h1 className="text-2xl font-bold mb-4 mt-5">Ticket Details</h1>
            <div className="bg-gray-700 shadow-md rounded mt-10 p-4">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-2">
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Ticket Title:</label>
                            <p className="w-2/3 text-gray-100">{ticket?.title}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Project Name:</label>
                            <p className="w-2/3 text-gray-100">{ticket?.projects.name}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Task Name:</label>
                            <p className="w-2/3 text-gray-100">{ticket?.tasks?.title}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-2">
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Developers</label>
                            <p className="w-2/3 text-gray-100">{ticket?.developer[0]?.name}</p>
                        </div>
                        <div className="flex mb-4">
                            <label className="w-1/3 text-gray-100 font-bold">Testers:</label>
                            <p className="w-2/3 text-gray-100">{ticket?.tester[0]?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-gray-700 shadow-md rounded mt-10 p-4 min-h-60'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Task Description</h1>
                <p className="text-gray-100">{ticket?.description}</p>
            </div>
            <div className='bg-gray-700 shadow-md rounded mt-10 p-4'>
                <h1 className="text-xl font-semibold mb-4 mt-5">Images</h1>
                <div className="flex flex-wrap">
                    {ticket?.upload_images?.slice(0, 3).map((image, index) => (
                        <div key={index} className="w-1/3 p-2">
                            <img
                                src={`${IMAGEURL}/${image}`}
                                alt={`Ticket Image ${index + 1}`}
                                className="cursor-pointer"
                                onClick={() => handleImageClick(`${IMAGEURL}/${image}`)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative">
                        <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetails;
