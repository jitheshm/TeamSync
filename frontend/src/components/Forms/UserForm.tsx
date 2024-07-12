"use client"
import { fetchBranches } from '@/api/tenantService/tenant';
import { fetchTenantSpecificUser, fetchTenantUsers, tenantUserRegister, tenantUserUpdate } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { IBranches } from '@/interfaces/Branches';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';

// Define the Zod schema
const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").nonempty("Name is required"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    phone_no: z.string().min(6, "Phone number must be at least 6 characters long").nonempty("Phone number is required"),
    role: z.string().nonempty("Role is required"),
    branch_id: z.string().nonempty("Branch is required"),
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

const roles = ['Manager', 'Project_Manager', 'Developer', 'Tester'];


function UserForm({ edit, userId }: { edit?: boolean, userId?: string }) {
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
        fetchBranches('',1,1000).then((res) => {
            console.log(res);
            
            setBranches(res.data.data)
        }).catch((err) => {
            if (err.response.status === 401) {
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
                if (err.response.status === 401) {
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
                    if (err.response.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    }
                })
            } else {
                tenantUserRegister(formData).then((res) => {
                    console.log(res);
                    router.push('/dashboard/users')
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout())

                        router.push('/login')
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
        <div className="min-h-screen flex items-center">
            <div className="w-full">
                <div className="bg-gray-900 p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-center text-gray-200 font-bold text-2xl mb-10">
                            {
                                edit ? 'Edit User' : 'Register User'
                            }
                        </h1>
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 font-bold text-gray-100">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 font-bold text-gray-100">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                className="border border-red-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone_no" className="block mb-2 font-bold text-gray-100">Phone Number</label>
                            <input
                                type="text"
                                id="phone_no"
                                name="phone_no"
                                placeholder="Phone Number"
                                className="border border-red-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.phone_no}
                                onChange={handleChange}
                            />
                            {errors.phone_no && <p className="text-red-500">{errors.phone_no}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="role" className="block mb-2 font-bold text-gray-100">Role</label>
                            <select
                                id="role"
                                name="role"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            {errors.role && <p className="text-red-500">{errors.role}</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="branch_id" className="block mb-2 font-bold text-gray-100">Branch</label>
                            <select
                                id="branch_id"
                                name="branch_id"
                                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                                value={formData.branch_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>{branch.location}</option>
                                ))}
                            </select>
                            {errors.branch_id && <p className="text-red-500">{errors.branch_id}</p>}
                        </div>
                        <button className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserForm;
