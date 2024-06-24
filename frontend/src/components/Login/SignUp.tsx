"use client"
import { signup } from '@/api/userService/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';


const signUpSchema = z.object({
    first_name: z.string().min(3, "First Name must be at least 3 characters long"),
    last_name: z.string().min(1, "Last Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
});


export interface SignupFormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface Errors {
    first_name?: string;
    last_name?: string
    email?: string
    password?: string
    confirm_password?: string
    general?: string;
}

const SignUp: React.FC = () => {


    const [formData, setFormData] = useState<SignupFormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = signUpSchema.safeParse(formData);

        if (result.success) {
            setErrors({});
            try {
                const data = await signup(formData);
                router.push('/')
            } catch (error: any) {
                if (error.response) {

                    const { status, data } = error.response;
                    setErrors({ general: data.error });

                } else {

                    setErrors({ general: "An unexpected error occurred. Please try again later." });
                }

            }
            console.log('Form data:', formData);

        } else {
            const formattedErrors: { [key: string]: string } = {};
            result.error.errors.forEach(err => {
                if (err.path) {
                    formattedErrors[err.path[0]] = err.message;
                }
            });
            setErrors(formattedErrors);
        }
    };

    return (
        <div className="w-3/4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium text-gray-900 dark:text-dark text-center">Sign up to our platform</h5>
                {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
                <div>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="First Name"
                    />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="Last Name"
                    />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="••••••••"
                    />
                    {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Create account
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-dark-300 text-center">
                    Have an account? <Link href={'/login'} className="text-blue-700 hover:underline dark:text-blue-500">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
