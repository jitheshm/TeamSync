/* eslint-disable @next/next/no-img-element */
"use client"
import { fetchSpecificTicketDetails } from '@/api/projectService/project';
import React, { useEffect, useState } from 'react';
import { ITicket } from '@/interfaces/Ticket';
import { User } from '@nextui-org/react';
import randomColor from 'randomcolor';
import fontColorContrast from 'font-color-contrast';

const TicketDetails = ({ projectId, taskId, ticketId }: { projectId: string, taskId: string, ticketId: string }) => {
    const [ticket, setTicket] = useState<ITicket>();
    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)
    useEffect(() => {
        fetchSpecificTicketDetails(projectId, taskId, ticketId).then((res) => {
            console.log(res.data);
            setTicket(res.data);
        });
    }, [projectId, taskId, ticketId]);


    return (
        <div className='md:px-16 p-4'>
            <div className='my-5 flex flex-wrap justify-between'>
                <p className='w-full md:w-auto'>
                    Ticket Details
                </p>
            </div>
            <div className='border border-border p-5 rounded-lg'>
                <User
                    name={ticket?.title}

                    avatarProps={{
                        radius: "lg",
                        style: {
                            fontSize: "20px",
                            backgroundColor: bgColor,
                            color: textFont,
                            fontWeight: 'bold'
                        },
                        name: ticket?.title.charAt(0).toUpperCase()
                    }}
                />
            </div>
            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <div className='w-full  flex flex-wrap gap-5 lg:gap-0'>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Ticket Name</p>
                            <p>{ticket?.title}</p>
                        </div>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Project Name</p>
                            <p>{ticket?.projects.name}</p>
                        </div>

                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5 '>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Task Name</p>
                            <p>{ticket?.tasks?.title}</p>
                        </div>

                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Status</p>
                            <p>{ticket?.status}</p>
                        </div>


                    </div>
                    <div className='w-full md:w-4/12 flex flex-col gap-5'>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Developer </p>
                            <p className="w-2/3 text-gray-100">{ticket?.developer[0]?.name}</p>

                        </div>
                        <div>
                            <p className='dark:text-gray-400 text-sm text-gray-500'>Tester </p>
                            <p className="w-2/3 text-gray-100">{ticket?.tester[0]?.name}</p>

                        </div>

                    </div>

                </div>
            </div>

            <div className='mt-8 border border-border p-5 rounded-lg w-full'>
                <h1 className="text-xl font-semibold mb-4 mt-5 ">Ticket Description</h1>
                <p className="text-gray-100">{ticket?.description}</p>
            </div>

        </div>
    );
};

export default TicketDetails;
