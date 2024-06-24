import { passwordReset } from '@/api/authService/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';

// Define interface for form data
export interface ResetFormData {
  new_password: string;
  confirm_password: string;
}

// Define interface for errors
interface FormErrors {
  new_password?: string;
  confirm_password?: string;
  general?: string;
}

const newPasswordSchema = z.object({
  new_password: z.string().min(6, 'Password must be at least 8 characters long'),
  confirm_password: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
});

function NewPassword() {
  const [formData, setFormData] = useState<ResetFormData>({
    new_password: '',
    confirm_password: '',
  });
  const router = useRouter()

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = newPasswordSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      try {
        const data = await passwordReset(formData);
        router.push('/login')

      } catch (error: any) {
        if (error.response) {
          console.log(error,"error");


          const { status, data } = error.response;
          setErrors({ general: data.error });

        } else {

          setErrors({ general: "An unexpected error occurred. Please try again later." });
        }
      }
    } else {
      const formattedErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        if (err.path) {
          formattedErrors[err.path[0] as keyof FormErrors] = err.message;
        }
      });
      setErrors(formattedErrors);
    }
  };

  return (
    <div className="w-3/4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h5 className="text-xl font-medium text-gray-900 dark:text-dark text-center">Create new password</h5>
        {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">New Password</label>
          <input
            type="password"
            name="new_password"
            id="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`bg-gray-50 border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
            required
          />
          {errors.new_password && (
            <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`bg-gray-50 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-dark`}
            required
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewPassword;
