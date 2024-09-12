"use client"
import { fetchAvailableTenantUsers, fetchTenantUsers } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z, ZodError } from 'zod';
import { createProject, fetchSpecificProject, updateProject } from '@/api/projectService/project';
import { ThemeState } from '@/features/theme/themeSlice';
import { errorModal } from '@/utils/alerts/errorAlert';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@nextui-org/react';

const projectSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
    description: z.string().trim().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    client_name: z.string().trim().min(3, "Client name must be at least 3 characters long").nonempty("Client name is required"),
    testers_id: z.array(z.string()).min(1, "At least one tester is required"),
    developers_id: z.array(z.string()).min(1, "At least one developer is required"),
    project_manager_id: z.string().trim().nonempty("Project Manager is required"),
    start_date: z.string().trim().nonempty("Start date is required"),
    end_date: z.string().trim().nonempty("End date is required"),
});

export interface ProjectFormData {
    name: string;
    description: string;
    client_name: string;
    testers_id: string[];
    developers_id: string[];
    project_manager_id: string;
    start_date: string;
    end_date: string;
}

interface FormErrors {
    name?: string;
    description?: string;
    client_name?: string;
    testers_id?: string;
    developers_id?: string;
    project_manager_id?: string;
    start_date?: string;
    end_date?: string;
}

interface RootState {
    theme: ThemeState
}

function ProjectForm({ edit = false, id }: { edit?: boolean, id?: string }) {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        client_name: '',
        testers_id: [],
        developers_id: [],
        project_manager_id: '',
        start_date: '',
        end_date: '',
    });

    const [defaultFormData, setDefaultFormData] = useState({
        developers: [],
        testers: [],
        project_manager: []
    })

    const [errors, setErrors] = useState<FormErrors>({});
    const [testers, setTesters] = useState([]);
    const [developer, setDeveloper] = useState([]);
    const [projectManager, setProjectManager] = useState([]);
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme)


    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAvailableTenantUsers('Tester').then((res) => {
            setTesters(res.data);
        }).catch((err) => {
            handleApiError(err);
        });

        fetchAvailableTenantUsers('Developer').then((res) => {
            console.log(res.data);

            setDeveloper(res.data);
        }).catch((err) => {
            handleApiError(err);
        });

        fetchAvailableTenantUsers('Project_Manager').then((res) => {
            setProjectManager(res.data);
        }).catch((err) => {
            handleApiError(err);
        });
    }, []);

    useEffect(() => {
        if (edit && id) {
            fetchSpecificProject(id).then((res) => {
                // console.log(res.data);
                // setDefaultFormData(res.data)

                setFormData(res.data);
                // console.log(res.data)
                setDefaultFormData({ developers: res.data.developers, testers: res.data.testers, project_manager: res.data.project_manager })

            }).catch((err) => {
                handleApiError(err);

            })
        }
    }, [])

    useEffect(() => {
        console.log("a");

        console.log(formData);

    }, [formData])

    // useEffect(() => {
    //     setDeveloper((prevState) => {
    //         return prevState.filter((dev) => !formData.developers_id.includes(dev._id))
    //     })
    //     console.log(formData);

    // }, [formData.developers_id])

    const handleApiError = (err: any) => {
        console.log(err);
        if (err.response && err.response?.status === 401) {
            dispatch(logout());
            router.push('/employee/login');
        } else {


            errorModal(err.response.data.errors || err.response.data.error)
        }
    };

    const handleChange = (e: any) => {
        console.log(e.target.value.split(','));

        const selectedDevelopers = e.target.value.split(',')
        console.log(selectedDevelopers);

        setFormData({ ...formData, developers_id: selectedDevelopers });


    };

    const handleTesterChange = (e: any) => {
        const selectedDevelopers = e.target.value.split(',')
        console.log(selectedDevelopers);

        setFormData({ ...formData, testers_id: selectedDevelopers });


    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            projectSchema.parse(formData);
            console.log('Form data is valid:', formData);
            setErrors({});
            if (!edit) {
                // Uncomment the createProject function call and router.push once implemented
                createProject(formData).then((res) => {
                    console.log(res);
                    router.push('/employee/manager/dashboard/projects');
                }).catch((err) => {
                    handleApiError(err);
                });
            }
            else {
                // Uncomment the createProject function call and router.push once implemented
                if (id) {
                    updateProject(formData, id).then((res) => {
                        console.log(res);
                        router.push('/employee/manager/dashboard/projects');
                    }).catch((err) => {
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
                        <h1 className="text-center text-gray-200 font-bold text-xl mb-6">
                            Create Project
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-1 mb-5">
                                <label htmlFor="name" className="block mb-2 font-bold text-gray-100">Name</label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    className="border border-gray-300  shadow p-3 w-full rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
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
                            <div className="col-span-1 mb-5">
                                <label htmlFor="client_name" className="block mb-2 font-bold text-gray-100">Client Name</label>
                                <Input
                                    type="text"
                                    id="client_name"
                                    name="client_name"
                                    placeholder="Client Name"
                                    className="border border-gray-300  shadow p-3 w-full rounded"
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                />
                                {errors.client_name && <p className="text-red-500">{errors.client_name}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="tester_id" className="block mb-2 font-bold text-gray-100">Tester</label>
                                <Select
                                    selectionMode="multiple"
                                    selectedKeys={formData.testers_id}
                                    id="testers_id"
                                    name="testers_id"
                                    placeholder='Select a tester'
                                    onChange={handleTesterChange}
                                    className=""
                                    key={formData.testers_id as any}
                                >



                                    {testers.filter(
                                        (tester: any) => !defaultFormData.testers.some((dTester: any) => dTester._id === tester._id)
                                    ).concat(defaultFormData.testers).map((tester: any) => (
                                        <SelectItem key={tester._id}>{tester.name}</SelectItem>
                                    ))}

                                </Select>
                                {errors.testers_id && <p className="text-red-500">{errors.testers_id}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="developers_id" className="block mb-2 font-bold text-gray-100">Developers</label>
                                <Select
                                    selectionMode="multiple"
                                    id="developers_id"
                                    name="developers_id"
                                    placeholder='Select a developer'
                                    selectedKeys={formData.developers_id}
                                    onChange={handleChange}
                                    className=""
                                    key={formData.developers_id as any}

                                >

                                    {developer.filter(
                                        (dev: any) => !defaultFormData.developers.some((dDev: any) => dDev._id === dev._id)
                                    ).concat(defaultFormData.developers).map((dev: any) => (
                                        <SelectItem key={dev._id}>{dev.name}</SelectItem>
                                    ))}
                                </Select>
                                {errors.developers_id && <p className="text-red-500">{errors.developers_id}</p>}
                            </div>
                            <div className="col-span-1 mb-5">
                                <label htmlFor="project_manager_id" className="block mb-2 font-bold text-gray-100">Project Manager</label>
                                <Select
                                    id="project_manager_id"
                                    name="project_manager_id"
                                    placeholder="Select a Project Manager"
                                    selectedKeys={formData.project_manager_id ? [formData.project_manager_id] : []}
                                    onChange={(e) =>
                                        setFormData({ ...formData, project_manager_id: e.target.value })
                                    }
                                >



                                    {projectManager.filter(
                                        (pm: any) => !defaultFormData.project_manager.some((dpm: any) => dpm._id === pm._id)
                                    ).concat(defaultFormData.project_manager).map((pm: any) => (
                                        <SelectItem key={pm._id}>{pm.name}</SelectItem>
                                    ))}

                                </Select>
                                {errors.project_manager_id && <p className="text-red-500">{errors.project_manager_id}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="start_date" className="block mb-2 font-bold text-gray-100">Start Date</label>

                                <Input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    min={currentDate}
                                    className="border border-gray-300  shadow p-3 w-fit rounded"
                                    value={formData.start_date.split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                                {errors.start_date && <p className="text-red-500">{errors.start_date}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="end_date" className="block mb-2 font-bold text-gray-100">End Date</label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    min={formData.start_date}
                                    disabled={!formData.start_date}
                                    className="border border-gray-300  shadow p-3 w-fit rounded"
                                    value={formData.end_date.split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                                {errors.end_date && <p className="text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>
                        <button type="submit" className="block w-full bg-primary text-white font-bold p-4 rounded-lg">{edit ? "Update" : "Create Project"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectForm;
