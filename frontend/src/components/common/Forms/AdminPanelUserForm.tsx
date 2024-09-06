"use client"
import { fetchBranches } from '@/api/tenantService/tenant';
import { fetchTenantSpecificUser, fetchTenantUsers, tenantUserRegister, tenantUserUpdate } from '@/api/userService/user';
import { Input } from '@/components/ui/input';
import { logout } from '@/features/user/userSlice';
import { IBranches } from '@/interfaces/Branches';
import { errorModal } from '@/utils/alerts/errorAlert';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';
import { SelectComponent } from '../Buttons/Select';

// Define the Zod schema
const userSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long").nonempty("Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"),
    email: z.string().trim().email("Invalid email address").nonempty("Email is required"),
    phone_no: z.string().trim().min(6, "Phone number must be at least 6 characters long").nonempty("Phone number is required"),
    role: z.string().trim().nonempty("Role is required"),
    branch_id: z.string().trim().nonempty("Branch is required"),
});

// Define the interface for form data
export interface TenantRegisterFormData {
    name: string;
    email: string;
    phone_no: string;
    role: string;
    branch_id: string;
}

// Define the interface for form errors
interface FormErrors {
    name?: string;
    email?: string;
    phone_no?: string;
    role?: string;
    branch_id?: string;
}

const roles = [{ name: 'Manager', value: 'Manager' }, { name: 'Project_Manager', value: 'Project_Manager' }, { name: 'Developer', value: 'Developer' }, { name: 'Tester', value: 'Tester' }];


function AdminPanelUserForm({ edit, userId }: { edit?: boolean, userId?: string }) {
    const [formData, setFormData] = useState<TenantRegisterFormData>({
        name: '',
        email: '',
        phone_no: '',
        role: '',
        branch_id: '',
    });
    const [branches, setBranches] = useState<IBranches[]>([])
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchBranches('', 1, 1000).then((res) => {
            console.log(res);

            setBranches(res.data.data)
        }).catch((err) => {
            if (err.response?.status === 401) {
                dispatch(logout())

                router.push('/login')
            }
        })
    }, [])

    useEffect(() => {
        if (edit && userId) {
            fetchTenantSpecificUser(userId).then((res) => {
                setFormData(res.data)
            }).catch((err) => {
                if (err.response?.status === 401) {
                    dispatch(logout())

                    router.push('/login')
                }

            })
        }
    }, [])


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value })
    }

    const handleBranchChange = (value: string) => {
        setFormData({ ...formData, branch_id: value })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            userSchema.parse(formData);
            console.log('Form data is valid:', formData);
            setErrors({});
            if (edit && userId) {
                tenantUserUpdate(formData, userId).then((res) => {
                    console.log(res);
                    router.push('/dashboard/users')
                }).catch((err) => {
                    if (err.response?.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    }
                    else {
                        errorModal(err.response.data.errors || err.response.data.error)
                    }
                })
            } else {
                tenantUserRegister(formData).then((res) => {
                    console.log(res);
                    router.push('/dashboard/users')
                }).catch((err) => {
                    if (err.response?.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    }
                    else {
                        console.log(err)
                        errorModal(err.response.data.errors || err.response.data.error)
                    }
                })
            }
        } catch (err) {
            if (err instanceof ZodError) {
                // Set validation errors
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
        <div className=" flex items-center ">
            <div className="w-full">
                <div className=" sm:border border-border my-5 p-6 w-full rounded-lg shadow  sm:w-3/4 mx-auto lg:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-center text-gray-200 font-bold text-xl mb-6">
                            {
                                edit ? 'Edit User' : 'Register User'
                            }
                        </h1>
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 font-bold text-gray-100">Name</label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-red-500 text-small">{errors.name}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 font-bold text-gray-100">Email</label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-small">{errors.email}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone_no" className="block mb-2 font-bold text-gray-100">Phone Number</label>
                            <Input
                                type="text"
                                id="phone_no"
                                name="phone_no"
                                placeholder="Phone Number"
                                value={formData.phone_no}
                                onChange={handleChange}
                            />
                            {errors.phone_no && <p className="text-red-500 text-small">{errors.phone_no}</p>}
                        </div>
                        <div className='flex flex-wrap gap-2 sm:gap-10'>
                            <div className="mb-5 w-full sm:w-5/12">
                                <label htmlFor="role" className="block mb-2 font-bold text-gray-100">Role</label>
                                <SelectComponent className='w-full' placeholder='Select a Role' active={formData.role} options={roles} handleValueChange={handleRoleChange} />

                                {errors.role && <p className="text-red-500 text-small">{errors.role}</p>}
                            </div>
                            <div className="mb-5 w-full sm:w-5/12">
                                <label htmlFor="branch_id" className="block mb-2 font-bold text-gray-100">Branch</label>
                                <SelectComponent className='w-full' placeholder='Select a Branch' active={formData.branch_id} options={branches.map((branch) => ({ name: branch.location, value: branch._id }))} handleValueChange={handleBranchChange} />


                                {errors.branch_id && <p className="text-red-500 text-small">{errors.branch_id}</p>}
                            </div>
                        </div>
                        <button className="block w-full bg-primary text-white font-bold p-4 rounded-lg">{edit ? <span>Update</span> : <span>Register</span>}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminPanelUserForm;
