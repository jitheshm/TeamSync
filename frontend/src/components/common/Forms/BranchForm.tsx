"use client"
import { createBranch, fetchBranch, updateBranch } from '@/api/tenantService/tenant';
import { Input } from '@/components/ui/input';
import { logout } from '@/features/user/userSlice';
import { errorModal } from '@/utils/alerts/errorAlert';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { boolean, z, ZodError } from 'zod';

const branchSchema = z.object({
    location: z.string().trim()
        .min(3, "Location must be at least 3 characters long")
        .regex(/^[a-zA-Z\s]+$/, "Location must only contain letters and spaces")
        .nonempty("Location is required"),
});

interface BranchFormProps {
    edit?: boolean;
    id?: string
}

const BranchForm: React.FC<BranchFormProps> = ({ edit = false, id }) => {
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter()
    const [apiError, setApiError] = useState<string | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (edit && id) {
            fetchBranch(id).then((result) => {
                setLocation(result.data.location)
            }).catch((err) => {
                console.log(err);

                if (err.response?.status === 401) {
                    dispatch(logout())

                    router.push('/login')
                }
            })
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            branchSchema.parse({ location });
            console.log('Form data is valid:', { location });
            setErrors({});
            if (edit && id) {
                // Update the branch here
                updateBranch(location, id).then(() => {
                    console.log('Branch updated successfully');
                    router.push('/dashboard/branches')
                }).catch((err) => {
                    console.log(err);


                    if (err.response?.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    }
                    else {
                        errorModal(err.response.data.errors || err.response.data.error)
                    }

                })
            } else {
                createBranch(location).then(() => {
                    console.log('Branch created successfully');
                    router.push('/dashboard/branches')

                }).catch((err) => {
                    console.log(err);

                    if (err.response?.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    } else {
                        setApiError(err.response.data.error)
                    }
                })

            }



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
        <div className=" flex items-center w-full h-screen">
            <div className="w-full">
                <div className=" sm:border border-border my-5 p-6 w-full rounded-lg shadow  sm:w-3/4 mx-auto lg:w-1/2">
                    <h2 className="text-2xl font-medium mb-4 text-gray-100 text-center">Create New Branch</h2>
                    {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="location" className="block text-gray-100 font-medium mb-2">Location</label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                className="border border-gray-300  shadow p-3 w-full rounded"
                                value={location}
                                onChange={handleChange}
                                required
                            />
                            {errors['location'] && <p className="text-red-500">{errors['location']}</p>}
                        </div>
                        <div className='text-center'>
                            <button type="submit" className="block w-full bg-primary text-white font-bold p-4 rounded-lg">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BranchForm;
