"use client"
import { adminLogin } from '@/api/authService/auth';
import React, { useState } from 'react';
import { z, ZodIssue } from 'zod';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/admin/adminSlice';


const userSchema = z.object({
  user_name: z.string().regex(/^[a-zA-Z]{3,}$/).min(3, "Name must have at least 3 letters"),
  password: z.string().min(5, "Password must be at least 8 characters long"),
});

interface FormErrors {
  user_name?: { _errors: string[] };
  password?: { _errors: string[] };
}
export interface AdminFormValues {
  user_name: string;
  password: string;

}
function Index() {
  const [formData, setFormData] = useState<AdminFormValues>({ user_name: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useDispatch()

const router=useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      setErrors({});
      adminLogin(formData).then((res) => {
        console.log('Form data is valid', formData);
        Cookie.set('team-sync-admin-token', res.token);
        dispatch(verify())
        router.push('/admin/dashboard')
        


      })
      console.log('Form data is valid', formData);
      setErrors({});
    }
  };

  return (
    <>
      <div className="bg-[url('/background.jpg')] h-screen bg-cover opacity-25 absolute w-full "></div>
      <section className="z-10 relative">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            TeamSync
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-950 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Admin Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="User name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name._errors[0]}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password._errors[0]}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Index;
