"use client"
import { signup } from '@/api/userService/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

const nameRegex = /^[A-Za-z\s]+$/;

const signUpSchema = z.object({
    first_name: z.string().trim()
        .min(3, { message: "First Name must be at least 3 characters long" })
        .regex(nameRegex, { message: "First Name must only contain alphabetic characters" }),
    last_name: z.string().trim()
        .min(1, { message: "Last Name is required" }).regex(nameRegex, { message: "Last Name must only contain alphabetic characters" }),
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().trim().min(6, "Confirm Password must be at least 6 characters long")
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

interface SignUpProps {
    setOtpPage: React.Dispatch<React.SetStateAction<boolean>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;

}

const SignUp: React.FC<SignUpProps> = ({ setOtpPage, setEmail }) => {


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
                setEmail(formData.email)
                // router.push('/')
                setOtpPage(true);
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
        <div className="w-3/4 p-4   backdrop-blur-sm shadow-lg  md:border border-gray-700 rounded-lg  sm:p-6 md:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium  text-center">Sign up to our platform</h5>
                {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
                <div>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.first_name ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        placeholder="First Name"
                    />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.last_name ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        placeholder="Last Name"
                    />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
                <div>
                    
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.email ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        
                        placeholder="Company Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.password ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        
                        placeholder="Password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        
                        placeholder="Confirm Password"
                    />
                    {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#628EFF] to-[#580475] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                    Create account
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-dark-300 text-center">
                    Have an account? <Link href={'/login'} className="text-white">Login</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
