"use client"
import { register } from '@/api/userService/user';
import { logout } from '@/features/admin/adminSlice';
import { errorModal } from '@/utils/alerts/errorAlert';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { z, ZodError } from 'zod';

// Define the Zod schema
const userSchema = z.object({
  first_name: z.string().min(3, "First name must be at least 3 characters long").nonempty("First name is required"),
  last_name: z.string().min(1, "Last name must be at least 1 characters long").nonempty("Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long").nonempty("Password is required"),
});

// Define the interface for form data
export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Define the interface for form errors
interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

function UserForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      // Validate the form data
      userSchema.parse(formData);
      // Submit the form data
      console.log('Form data is valid:', formData);
      setErrors({}); // Clear errors if validation passes
      register(formData).then((res) => {
        console.log(res);
        router.push('/admin/dashboard/users')
      }).catch((err) => {
        if (err.response?.status === 401) {
          dispatch(logout())

          router.push('/admin/login')
        }
        else {
          errorModal(err.response.data.errors || err.response.data.error)
        }
      })
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
        <div className="bg-gray-700 p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center text-blue-400 font-bold text-2xl mb-10">Register New User</h1>
            <div className="mb-5">
              <label htmlFor="first_name" className="block mb-2 font-bold text-gray-100">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="First Name"
                className="border border-gray-300 text-gray-950 shadow p-3 w-full rounded"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="last_name" className="block mb-2 font-bold text-gray-100">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                className="border border-red-300 text-gray-950 shadow p-3 w-full rounded"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
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
              <label htmlFor="password" className="block mb-2 font-bold text-gray-100">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="border border-red-300 text-gray-950 shadow p-3 w-full rounded"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>
            <button className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
