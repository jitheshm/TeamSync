"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import { login } from '@/api/authService/auth';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/user/userSlice';
import { useRouter } from "next/navigation"
// Define the Zod schema
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface LoginFormData {
    email: string;
    password: string;
}

interface Errors {
    email?: {
        _errors: string[];
    };
    password?: {
        _errors: string[];
    };
    general?: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<Errors>({});
    const dispatch = useDispatch();
    const router = useRouter();


    

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = loginSchema.safeParse(formData);

        if (result.success) {
            setErrors({});
            try {
                const data = await login(formData);
                Cookies.set('team-sync-user-token', data.token, { expires: 1 })
                router.push('/')
            } catch (error: any) {
                if (error.response) {

                    const { status, data } = error.response;
                    setErrors({ general: data.error });

                } else {

                    setErrors({ general: "An unexpected error occurred. Please try again later." });
                }
            }
        } else {
            const formattedErrors = result.error.format();
            setErrors(formattedErrors);
        }
    };

    return (
        <div className="w-3/4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium text-gray-900 dark:text-dark text-center">Sign in to our platform</h5>
                {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Your email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                        placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email._errors[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Your password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password._errors[0]}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Login to your account
                </button>
                <hr />
                <div className='text-center'>
                    <i className="fab fa-google" style={{ color: "#000000", fontSize: "25px" }} />
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-dark-300 text-center">
                    Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
