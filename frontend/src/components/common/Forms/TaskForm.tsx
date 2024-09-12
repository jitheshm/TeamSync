"use client"
import { fetchAvailableTenantUsers } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z, ZodError } from 'zod';
import { createTask, fetchAvailableProjectUsers, fetchSpecificTaskDetails, updateTask } from '@/api/projectService/project';
import { ThemeState } from '@/features/theme/themeSlice';
import { errorModal } from '@/utils/alerts/errorAlert';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@nextui-org/react';
// import { createTask } from '@/api/taskService/task';

const taskSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long").nonempty("Title is required"),
    description: z.string().trim().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    due_date: z.string().trim().nonempty("Due date is required"),
    developer_id: z.string().trim().nonempty("Developer is required"),
    tester_id: z.string().trim().nonempty("Tester is required"),
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
interface RootState {
    theme: ThemeState
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
    const [developers, setDevelopers] = useState<{ _id: string, name: string }[]>([]);
    const [testers, setTesters] = useState<{ _id: string, name: string }[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme)


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
        console.log(formData)
    }, [formData])


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
        if (err.response && err.response?.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        } else {
            errorModal(err.response.data.errors || err.response.data.error)
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
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    return (
        <div className=" flex items-center w-full">
            <div className="w-full">
                <div className=" sm:border border-border my-5 p-6 w-full rounded-lg shadow  sm:w-3/4 mx-auto lg:w-1/2">
                    <form onSubmit={handleSubmit}>
                        {
                            edit ? <h1 className="text-2xl font-bold text-gray-100 mb-5">Edit Task</h1> : <h1 className="text-2xl font-bold text-gray-100 mb-5">Create Task</h1>
                        }
                        <div className="mb-5">
                            <label htmlFor="title" className="block mb-2 font-bold text-gray-100">Title</label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                className="border border-gray-300 shadow p-3 w-full rounded "
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            {errors.title && <p className="text-red-500">{errors.title}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className="block mb-2 font-bold text-gray-100">Description</label>
                            <Input
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                className="border border-gray-300  shadow p-3 w-full rounded"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            {errors.description && <p className="text-red-500">{errors.description}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="due_date" className="block mb-2 font-bold text-gray-100">Due Date</label>
                            <Input
                                type="date"
                                id="due_date"
                                name="due_date"
                                min={currentDate}
                                className="border border-gray-300  shadow p-3 w-fit rounded"
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
                                selectedKeys={formData.developer_id ? [formData.developer_id] : []}
                                onChange={(e) => setFormData({ ...formData, developer_id: e.target.value })}
                                className=""
                                key={formData.developer._id}
                                placeholder='Select a developer'
                            >
                                {developers
                                    .filter((developer: any) => formData.developer._id !== developer._id) // Filter out the selected developer
                                    .concat(formData.developer._id ? [formData.developer] : []) // Add the selected developer only if _id is not empty
                                    .map((developer: any) => (
                                        <SelectItem key={developer._id}>{developer.name}</SelectItem>
                                    ))}
                            </Select>

                            {errors.developer_id && <p className="text-red-500">{errors.developer_id}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="tester_id" className="block mb-2 font-bold text-gray-100">Tester</label>
                            <Select
                                id="tester_id"
                                name="tester_id"
                                selectedKeys={formData.tester_id ? [formData.tester_id] : []}
                                onChange={(e) => setFormData({ ...formData, tester_id: e.target.value })}
                                className=""
                                key={formData.tester._id}
                                placeholder='Select a tester'
                            >
                                {testers
                                    .filter((tester: any) => formData.tester._id !== tester._id)
                                    .concat(formData.tester._id ? [formData.tester] : [])
                                    .map((tester: any) => (
                                        <SelectItem key={tester._id}>{tester.name}</SelectItem>
                                    ))}
                            </Select>

                            {errors.tester_id && <p className="text-red-500">{errors.tester_id}</p>}
                        </div>
                        {
                            edit ? <button type="submit" className="block w-full bg-primary text-white font-bold p-4 rounded-lg">Update Task</button> : <button type="submit" className="block w-full bg-primary text-white font-bold p-4 rounded-lg">Create Task</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;
