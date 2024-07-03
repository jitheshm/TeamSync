"use client"
import { createBranch } from '@/api/tenantService/tenant';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z, ZodError } from 'zod';

const branchSchema = z.object({
    location: z.string()
        .min(3, "Location must be at least 3 characters long")
        .regex(/^[a-zA-Z\s]+$/, "Location must only contain letters and spaces")
        .nonempty("Location is required"),
});

function BranchForm() {
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            branchSchema.parse({ location });
            console.log('Form data is valid:', { location });
            setErrors({});
            createBranch(location).then(() => {
                console.log('Branch created successfully');
                router.push('/dashboard/branch')

            }).catch(() => {
                console.log('Branch creation failed');
            })


            // Submit the form data to the server here

        } catch (err) {
            if (err instanceof ZodError) {
                const formattedErrors: { [key: string]: string } = {};
                err.errors.forEach((error) => {
                    const path = error.path.join('.');
                    formattedErrors[path] = error.message;
                });
                setErrors(formattedErrors);
            }
        }
    };

    return (
        <div className="bg-gray-800 border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl md:mt-60">
            <h2 className="text-2xl font-medium mb-4 text-gray-100 text-center">Create New Branch</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-100 font-medium mb-2">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400 text-black"
                        value={location}
                        onChange={handleChange}
                        required
                    />
                    {errors['location'] && <p className="text-red-500">{errors['location']}</p>}
                </div>
                <div className='text-center'>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default BranchForm;
