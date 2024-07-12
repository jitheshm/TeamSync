"use client"
import { fetchAvailableTenantUsers } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';
import Select from 'react-select';
import { createTask, fetchAvailableProjectUsers, fetchSpecificTaskDetails, updateTask } from '@/api/projectService/project';
// import { createTask } from '@/api/taskService/task';

const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").nonempty("Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    due_date: z.string().nonempty("Due date is required"),
    developer_id: z.string().nonempty("Developer is required"),
    tester_id: z.string().nonempty("Tester is required"),
});

export interface TaskFormData {
    title: string;
    description: string;
    due_date: string;
    developer_id: string;
    tester_id: string;
    developer: {
        _id: string;
        name: string;
    }
    tester: {
        _id: string;
        name: string;
    }

}

interface FormErrors {
    title?: string;
    description?: string;
    due_date?: string;
    developer_id?: string;
    tester_id?: string;
}

function TaskForm({ projectId, taskId, edit = false }: { projectId: string, taskId?: string, edit?: boolean }) {
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        due_date: '',
        developer_id: '',
        tester_id: '',
        developer: {
            _id: '',
            name: ''
        },
        tester: {
            _id: '',
            name: ''
        }
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [developers, setDevelopers] = useState([]);
    const [testers, setTesters] = useState([]);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAvailableProjectUsers(projectId).then((res) => {
            // setDevelopers(res.data);
            console.log(res.data);

            setDevelopers(res.data.developers)
            setTesters(res.data.testers)
        }).catch((err) => {
            handleApiError(err);
        });

    }, []);

    useEffect(() => {
        if (edit && taskId) {
            fetchSpecificTaskDetails(projectId, taskId).then((res) => {
                console.log(res.data);
                
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    due_date: res.data.due_date,
                    developer_id: res.data.developer_id,
                    tester_id: res.data.tester_id,
                    developer: res.data.developer[0],
                    tester: res.data.tester[0]
                });
            })
        }
    }, [edit])

    const handleApiError = (err: any) => {
        if (err.response && err.response.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            taskSchema.parse(formData);
            setErrors({});
            if (!edit) {
                createTask(formData, projectId).then(() => {
                    router.push(`/employee/project_manager/dashboard/projects/${projectId}/tasks/`);
                }).catch((err: any) => {
                    handleApiError(err);
                });
            }
            else {
                if (taskId) {
                    
                    updateTask(formData, projectId, taskId).then(() => {
                        router.push(`/employee/project_manager/dashboard/projects/${projectId}/tasks/${taskId}`);
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
                            edit ? <h1 className="text-2xl font-bold text-gray-100 mb-5">Edit Task</h1> : <h1 className="text-2xl font-bold text-gray-100 mb-5">Create Task</h1>
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
                            <input
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            {errors.description && <p className="text-red-500">{errors.description}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="due_date" className="block mb-2 font-bold text-gray-100">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.due_date.split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            />
                            {errors.due_date && <p className="text-red-500">{errors.due_date}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="developer_id" className="block mb-2 font-bold text-gray-100">Developer</label>
                            <Select
                                id="developer_id"
                                name="developer_id"
                                defaultValue={edit ? { value: formData.developer._id, label: formData.developer.name } : null}
                                options={developers.map(dev => ({ value: dev._id, label: dev.name }))}
                                onChange={(option: any) => setFormData({ ...formData, developer_id: option.value })}
                                className="basic-single text-gray-950"
                                classNamePrefix="select"
                                key={formData.developer._id}
                            />
                            {errors.developer_id && <p className="text-red-500">{errors.developer_id}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="tester_id" className="block mb-2 font-bold text-gray-100">Tester</label>
                            <Select
                                id="tester_id"
                                name="tester_id"
                                defaultValue={edit ? { value: formData.tester._id, label: formData.tester.name } : null}
                                options={testers.map(test => ({ value: test._id, label: test.name }))}
                                onChange={(option: any) => setFormData({ ...formData, tester_id: option.value })}
                                className="basic-single text-gray-950"
                                key={formData.tester._id}

                                classNamePrefix="select"
                            />
                            {errors.tester_id && <p className="text-red-500">{errors.tester_id}</p>}
                        </div>
                        {
                            edit ? <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Update Task</button> : <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Create Task</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;
