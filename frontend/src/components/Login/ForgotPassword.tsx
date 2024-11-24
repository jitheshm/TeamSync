import { forgetPassword } from '@/api/authService/auth';
import Link from 'next/link';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';


const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
});


export interface ForgotPasswordFormData {
    email: string;
}


interface Errors {
    email?: {
        _errors: string[];
    };
    general?: string;
}

interface ForgotPasswordProps {
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setOtpVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setEmail, setOtpVisible }) => {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
    const [errors, setErrors] = useState<Errors>({});


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = forgotPasswordSchema.safeParse(formData);

        if (result.success) {
            setErrors({});
            try {
                const data = await forgetPassword(formData)
                setEmail(formData.email)
                setOtpVisible(true)

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
        <div className="w-3/4 p-4   backdrop-blur-sm shadow-lg  md:border border-gray-700 rounded-lg  sm:p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium  text-center">Forgot Password?</h5>
                {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium ">Your email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.email ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        placeholder="name@company.com"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email._errors[0]}</p>}
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#628EFF] to-[#580475] font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Send OTP</button>
                <div className="text-sm font-medium text-gray-500 dark:text-dark-300 text-center">
                    Not registered? <Link href="/signup" className="text-white">Create account</Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;
