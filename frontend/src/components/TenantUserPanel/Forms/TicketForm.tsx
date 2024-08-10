"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z, ZodError } from 'zod';
import { logout } from '@/features/user/userSlice';
import Swal from 'sweetalert2';
import { createTicket, fetchSpecificTicketDetails, updateTicket } from '@/api/projectService/project';
import { IMAGEURL } from '@/constants/constant';
import { ThemeState } from '@/features/theme/themeSlice';
import { errorModal } from '@/utils/alerts/errorAlert';

const ticketSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long").nonempty("Title is required"),
    description: z.string().trim().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    
});

export interface TicketFormData {
    title: string;
    description: string;
   
}

interface FormErrors {
    title?: string;
    description?: string;
   
}

interface RootState {
    theme: ThemeState
}

function TicketForm({ ticketId, edit = false, projectId, taskId }: { ticketId?: string, edit?: boolean, projectId: string, taskId: string }) {
    const [formData, setFormData] = useState<TicketFormData>({
        title: '',
        description: '',
       
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme)


    useEffect(() => {
        if (edit && ticketId) {
            fetchSpecificTicketDetails(projectId, taskId, ticketId).then((res) => {
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    
                });
               
            }).catch((err) => {
                handleApiError(err);
            });
        }
    }, [edit, ticketId]);

    const handleApiError = (err: any) => {
        if (err.response && err.response?.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        }else{
            errorModal(err.response.data.errors||err.response.data.error)
        }
    };

    

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            ticketSchema.parse(formData);
            setErrors({});
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            
            console.log(formDataToSend);


            if (!edit) {
                createTicket(formDataToSend, projectId, taskId).then(() => {
                    router.push(`/employee/tester/dashboard/projects/${projectId}/tasks/${taskId}/tickets`);
                }).catch((err: any) => {
                    handleApiError(err);
                });
            } else {
                if (ticketId) {
                    updateTicket(formDataToSend,projectId,taskId, ticketId).then(() => {
                        router.push(`/employee/tester/dashboard/projects/${projectId}/tasks/${taskId}/tickets`);
                    }).catch((err: any) => {
                        handleApiError(err);
                    });
                }
            }
        } catch (err) {
            if (err instanceof ZodError) {
                const formattedErrors: FormErrors = {};
                err.errors.forEach((error) => {
                    if (error.path.length) {
                        const field = error.path[0] as keyof FormErrors;
                        if (!formattedErrors[field]) {
                            formattedErrors[field] = error.message;
                        }
                    }
                });
                setErrors(formattedErrors);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center w-full">
            <div className="w-full">
                <div className={` ${background} p-10 rounded-lg shadow  lg:w-10/12 xl:w-8/12 mx-auto `}>
                    <form onSubmit={handleSubmit}>
                        {
                            edit ? <h1 className="text-2xl font-bold text-gray-100 mb-5">Edit Ticket</h1> : <h1 className="text-2xl font-bold text-gray-100 text-center mb-5">Create Ticket</h1>
                        }
                        <div className="mb-5">
                            <label htmlFor="title" className="block mb-2 font-bold text-gray-100">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            {errors.title && <p className="text-red-500">{errors.title}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className="block mb-2 font-bold text-gray-100">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Description"
                                className="border border-gray-300 text-gray-950 shadow p-3 h-60 w-full rounded"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            {errors.description && <p className="text-red-500">{errors.description}</p>}
                        </div>
                        
                        {
                            edit ? <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Update Ticket</button> : <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Create Ticket</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TicketForm;
