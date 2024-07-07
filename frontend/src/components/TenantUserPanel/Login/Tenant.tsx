"use client"
import { fetchTenantByName } from '@/api/tenantService/tenant';
import React, { useState } from 'react';
import { z, ZodError } from 'zod';

const loginSchema = z.object({
  companyName: z.string()
    .nonempty("Company name is required"),
});

interface TenantProps {
  setTenantId: React.Dispatch<React.SetStateAction<string>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}


const Tenant: React.FC<TenantProps> = ({ setTenantId, setLogin }) => {

  const [formData, setFormData] = useState({ companyName: '' });
  const [errors, setErrors] = useState<{ [key: string]: { _errors: string[] } }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      console.log('Form data is valid:', formData);
      setErrors({});
      fetchTenantByName(formData.companyName).then((res) => {
        console.log(res);
        
        setTenantId(res.data._id)
        setLogin(true)

      }).catch((err) => {
        setErrors({ companyName: { _errors: ['Tenant not found'] } })

      })


    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: { [key: string]: { _errors: string[] } } = {};
        err.errors.forEach((error) => {
          const path = error.path.join('.');
          formattedErrors[path] = { _errors: [error.message] };
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <>
      <div className=" h-screen bg-cover opacity-25 absolute w-full "></div>
      <section className="z-10 relative">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
            TeamSync
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-950 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Tenant Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName._errors[0]}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Tenant;
