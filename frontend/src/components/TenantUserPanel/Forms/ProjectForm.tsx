"use client"
import { fetchTenantUsers } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';
import Select from 'react-select';
import { createProject } from '@/api/projectService/project';

const projectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
    description: z.string().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    client_name: z.string().min(3, "Client name must be at least 3 characters long").nonempty("Client name is required"),
    tester_id: z.string().nonempty("Tester is required"),
    developers_id: z.array(z.string()).min(1, "At least one developer is required"),
    project_manager_id: z.string().nonempty("Project Manager is required"),
    start_date: z.string().nonempty("Start date is required"),
    end_date: z.string().nonempty("End date is required"),
});

export interface ProjectFormData {
    name: string;
    description: string;
    client_name: string;
    tester_id: string;
    developers_id: string[];
    project_manager_id: string;
    start_date: string;
    end_date: string;
}

interface FormErrors {
    name?: string;
    description?: string;
    client_name?: string;
    tester_id?: string;
    developers_id?: string;
    project_manager_id?: string;
    start_date?: string;
    end_date?: string;
}


function ProjectForm() {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        client_name: '',
        tester_id: '',
        developers_id: [],
        project_manager_id: '',
        start_date: '',
        end_date: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [testers, setTesters] = useState([]);
    const [developer, setDeveloper] = useState([]);
    const [projectManager, setProjectManager] = useState([]);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTenantUsers('Tester').then((res) => {
            setTesters(res.data);
        }).catch((err) => {
            handleApiError(err);
        });

        fetchTenantUsers('Developer').then((res) => {
            console.log(res.data);

            setDeveloper(res.data);
        }).catch((err) => {
            handleApiError(err);
        });

        fetchTenantUsers('Project_Manager').then((res) => {
            setProjectManager(res.data);
        }).catch((err) => {
            handleApiError(err);
        });
    }, []);

    useEffect(() => {
        setDeveloper((prevState) => {
            return prevState.filter((dev) => !formData.developers_id.includes(dev._id))
        })
        console.log(formData);

    },[formData.developers_id])

    const handleApiError = (err: any) => {
        if (err.response && err.response.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        }
    };

    const handleChange = (selectedOptions: any) => {
        const selectedDevelopers = selectedOptions.map((option: any) => option.value);
        setFormData({ ...formData, developers_id: selectedDevelopers });


    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            projectSchema.parse(formData);
            console.log('Form data is valid:', formData);
            setErrors({});
            // Uncomment the createProject function call and router.push once implemented
            createProject(formData).then((res) => {
                console.log(res);
                router.push('/employee/manager/dashboard/projects');
            }).catch((err) => {
                handleApiError(err);
            });
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
                <div className="bg-gray-900 p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-center text-gray-200 font-bold text-2xl mb-10">
                            Create Project
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-1 mb-5">
                                <label htmlFor="name" className="block mb-2 font-bold text-gray-100">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
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
                            <div className="col-span-1 mb-5">
                                <label htmlFor="client_name" className="block mb-2 font-bold text-gray-100">Client Name</label>
                                <input
                                    type="text"
                                    id="client_name"
                                    name="client_name"
                                    placeholder="Client Name"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                />
                                {errors.client_name && <p className="text-red-500">{errors.client_name}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="tester_id" className="block mb-2 font-bold text-gray-100">Tester</label>
                                <select
                                    id="tester_id"
                                    name="tester_id"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.tester_id}
                                    onChange={(e) => setFormData({ ...formData, tester_id: e.target.value })}
                                >
                                    <option value="">Select Tester</option>
                                    {testers.map((tester: any) => (
                                        <option key={tester._id} value={tester._id} className=''>{tester.name}</option>
                                    ))}
                                </select>
                                {errors.tester_id && <p className="text-red-500">{errors.tester_id}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="developers_id" className="block mb-2 font-bold text-gray-100">Developers</label>
                                <Select
                                    id="developers_id"
                                    name="developers_id"
                                    options={developer.map(dev => ({ value: dev._id, label: dev.name }))}
                                    value={formData.developers_id}
                                    isMulti
                                    onChange={handleChange}
                                    className="basic-multi-select text-gray-950"
                                    classNamePrefix="select"
                                />
                                {errors.developers_id && <p className="text-red-500">{errors.developers_id}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="project_manager_id" className="block mb-2 font-bold text-gray-100">Project Manager</label>
                                <select
                                    id="project_manager_id"
                                    name="project_manager_id"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.project_manager_id}
                                    onChange={(e) => setFormData({ ...formData, project_manager_id: e.target.value })}
                                >
                                    <option value="">Select Project Manager</option>
                                    {projectManager.map((manager: any) => (
                                        <option key={manager._id} value={manager._id}>{manager.name}</option>
                                    ))}
                                </select>
                                {errors.project_manager_id && <p className="text-red-500">{errors.project_manager_id}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="start_date" className="block mb-2 font-bold text-gray-100">Start Date</label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                                {errors.start_date && <p className="text-red-500">{errors.start_date}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="end_date" className="block mb-2 font-bold text-gray-100">End Date</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                                {errors.end_date && <p className="text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                        <button type="submit" className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Create Project</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectForm;
