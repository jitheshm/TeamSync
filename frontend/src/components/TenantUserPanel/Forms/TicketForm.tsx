"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';
import { logout } from '@/features/user/userSlice';
import Swal from 'sweetalert2';
import { createTicket, fetchSpecificTicketDetails, updateTicket } from '@/api/projectService/project';
import { IMAGEURL } from '@/constants/constant';

const ticketSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").nonempty("Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    files: z.array(z.instanceof(File)).max(3, "You can upload a maximum of 3 files")
});

export interface TicketFormData {
    title: string;
    description: string;
    files: File[];
    oldImageUrl: string[];
}

interface FormErrors {
    title?: string;
    description?: string;
    files?: string;
}

function TicketForm({ ticketId, edit = false, projectId, taskId }: { ticketId?: string, edit?: boolean, projectId: string, taskId: string }) {
    const [formData, setFormData] = useState<TicketFormData>({
        title: '',
        description: '',
        files: [],
        oldImageUrl: []
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (edit && ticketId) {
            fetchSpecificTicketDetails(projectId, taskId, ticketId).then((res) => {
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    files: [],
                    oldImageUrl: []
                });
                setImagePreviews(res.data.upload_images.map((image: any) => IMAGEURL + '/' + image));
            }).catch((err) => {
                handleApiError(err);
            });
        }
    }, [edit, ticketId]);

    const handleApiError = (err: any) => {
        if (err.response && err.response.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 3) {
            e.target.files = null;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You can upload a maximum of 3 files',
            })
            // alert('You can upload a maximum of 3 files');
            return;
        }
        setFormData({ ...formData, files });
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            ticketSchema.parse(formData);
            setErrors({});
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formData.files.forEach((image, index) => {
                console.log(image);

                formDataToSend.append('files', image);
            });
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
        <div className="min-h-screen flex items-center">
            <div className="w-full">
                <div className="bg-gray-800 p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
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
                            !edit && <div className="mb-5">
                                <label htmlFor="files" className="block mb-2 font-bold text-gray-100">Upload Images (Max 3)</label>
                                <input
                                    type="file"
                                    id="files"
                                    name="files"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border border-gray-300 text-white shadow p-3 w-full rounded"
                                />
                                {errors.files && <p className="text-red-500">{errors.files}</p>}
                            </div>
                        }
                        {imagePreviews.length > 0 && (
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-gray-100 mb-3">Image Previews</h2>
                                <div className="flex flex-wrap gap-2">
                                    {imagePreviews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
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
