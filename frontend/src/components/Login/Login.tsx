"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import { firebaseLogin, login } from '@/api/authService/auth';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/user/userSlice';
import { useRouter } from "next/navigation"
import Link from 'next/link';
import firebase from '@/config/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
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
                Cookies.set('team-sync-token', data.accessToken, { expires: 1 })
                localStorage.setItem('team-sync-refresh-token', data.refreshToken);
                console.log(data);

                dispatch(verify({ name: data.name, tenantId: data.tenantId ?? '',role:data.role,id:data.id }))
                router.push('/')
            } catch (error: any) {
                console.log(error);
                
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




    const signInWithGoogle = async () => {
        try {
            const auth = getAuth(firebase);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider)


            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential);

            const token = await auth.currentUser?.getIdToken()
            if (token) {
                const data = await firebaseLogin(token);
                Cookies.set('team-sync-token', data.accessToken, { expires: 1 })
                localStorage.setItem('team-sync-refresh-token', data.refreshToken);

                console.log(data);
                console.log("hai")

                dispatch(verify({ name: data.name, tenantId: data.tenantId ?? '',role:data.role,id:data.id }))
                router.push('/')

            }
        } catch (error) {
            console.log(error);

        }



    }

    return (
        <div className="w-3/4 p-4 mt-4  backdrop-blur-sm shadow-lg  border border-gray-700 rounded-lg  sm:p-6 md:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <h5 className="text-xl font-medium  text-center">Sign in to our platform</h5>
                {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium ">Your email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-transparent border ${errors.email ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                        placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email._errors[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium ">Your password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`bg-transparent border ${errors.password ? 'border-red-500' : 'border-gray-300'}  text-sm rounded-lg block w-full p-2 `}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password._errors[0]}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#628EFF] to-[#580475] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                    Login to your account
                </button>
                <div className="text-sm font-medium text-center">
                    <Link href={'/forgot-password'} >Forgot Password?</Link>
                </div>
                <hr />
                <div className='text-center'>
                    
                    <FcGoogle onClick={signInWithGoogle} className='flex mx-auto hover:cursor-pointer' size={35}/>
                </div>
                <div className="text-sm font-medium  text-gray-500 text-center">
                    Not registered? <Link href={'/signup'} className=" text-white">Create account</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
