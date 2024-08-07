"use client"
import { createPlan, fetchPlanDetails } from '@/api/subscriptionService/subscription';
import { logout } from '@/features/admin/adminSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z, ZodError } from 'zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { errorModal } from '@/utils/alerts/errorAlert';
import { ThemeState } from '@/features/theme/themeSlice';

export interface PlanFormData {
    name: string;
    price: string;
    features: {
        meetings: number;
        branches: number;
        support: string;
    };
    description: string;
    currency: string;
    bill_cycle: string;
}

interface RootState {
    theme: ThemeState
}

const planSchema = z.object({
    name: z.string().trim().min(3, "Plan name must be at least 3 characters long").nonempty("Plan name is required"),
    price: z.string().regex(/^\d+$/, "Price must be a string of digits").min(1, "Price must be specified").nonempty("Price is required"),
    features: z.object({
        meetings: z.number().int().min(1, "Meetings feature must be at least 1"),
        branches: z.number().int().min(1, "brancheses feature must be at least 1"),
        support: z.string().min(1, "Support feature must be specified").nonempty("Support is required"),
    }),
    description: z.string().trim().min(10, "Description must be at least 10 characters long").nonempty("Description is required"),
    currency: z.string().min(1, "Currency must be specified").nonempty("Currency is required"),
    bill_cycle: z.string().min(1, "Bill cycle must be specified").nonempty("Bill cycle is required"),
});


function PlanForm({ viewOnly = false, id }: { viewOnly?: boolean; id?: string }) {
    const [formData, setFormData] = useState<PlanFormData>({
        name: '',
        price: '',
        features: {
            meetings: 10,
            branches: 0,
            support: 'expert',
        },
        description: '',
        currency: 'usd',
        bill_cycle: 'month',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { background, text, main } = useSelector((state: RootState) => state.theme)

    useEffect(() => {
        if (viewOnly) {
            fetchPlanDetails(id as string).then((res) => {
                setFormData(res.data)
            }).catch((err) => {
                if(err.response.status===401){
                    dispatch(logout())

                    router.push('/admin/login')
                }
            })
        }
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!viewOnly) {
            const { name, value } = e.target;
            if (name.startsWith('features.')) {
                const featureName = name.split('.')[1];
                setFormData({
                    ...formData,
                    features: {
                        ...formData.features,
                        [featureName]: featureName === 'support' ? value : parseInt(value),
                    },
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: name === 'price' ? value : value,
                });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!viewOnly) {
            e.preventDefault();
            try {
                planSchema.parse(formData);
                console.log('Form data is valid:', formData);
                setErrors({});
                createPlan(formData).then(() => {
                    console.log('Plan created successfully');
                    router.push('/admin/dashboard/plans');
                }).catch((err) => {
                    console.log(err);
                    if (err.response.status === 401) {
                        Cookies.remove('team-sync-admin-token')
                        dispatch(logout())
                    }
                    else{
                        errorModal(err.response.data.errors||err.response.data.error)
                    }
                    console.log('An error occurred while creating the plan');
                });
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
        }
    };

    return (
        <div className='py-4 sm-pt-10 h-screen w-full'>

            <div className={`${background} p-4 w-11/12 mx-auto rounded `}>

                <div>
                    {
                        viewOnly ? <h4 className="text-3xl font-bold tracki text-center mt-12 sm:text-4xl text-gray-100">Plan Details</h4> :
                            <h4 className="text-3xl font-bold tracki text-center mt-12 sm:text-4xl text-gray-100">Create New Plan</h4>
                    }
                </div>
                <form className='sm:w-1/2 mx-auto mt-20' onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            {/* <h2 className="text-base font-semibold leading-7 text-gray-100">Plan Details</h2> */}
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-100">Plan name</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-100"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        />
                                        {errors['name'] && <p className="text-red-500">{errors['name']}</p>}
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-100">Plan Price</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            className="block bg-gray-100 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={formData.price}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        />
                                        {errors['price'] && <p className="text-red-500">{errors['price']}</p>}
                                    </div>
                                </div>
                                {/* <div className="sm:col-span-2">
                                    <label htmlFor="features.meetings" className="block text-sm font-medium leading-6 text-gray-100">Meetings</label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="features.meetings"
                                            id="features.meetings"
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={formData.features.meetings}
                                            onChange={handleChange}
                                            
                                            disabled={viewOnly}
                                        />
                                        {errors['features.meetings'] && <p className="text-red-500">{errors['features.meetings']}</p>}
                                    </div>
                                </div> */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="features.branches" className="block text-sm font-medium leading-6 text-gray-100">brancheses</label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="features.branches"
                                            id="features.branches"
                                            className="block w-full bg-gray-100 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={formData.features.branches}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        />
                                        {errors['features.branches'] && <p className="text-red-500">{errors['features.branches']}</p>}
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="features.support" className="block text-sm font-medium leading-6 text-gray-100">Support</label>
                                    <div className="mt-2 bg-gray-100">
                                        <select
                                            id="features.support"
                                            name="features.support"
                                            className="block w-full bg-gray-100 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            value={formData.features.support}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        >
                                            <option value={'basic'}>Basic</option>
                                            <option value={'expert'}>Expert</option>
                                        </select>
                                        {errors['features.support'] && <p className="text-red-500">{errors['features.support']}</p>}
                                    </div>
                                </div>
                                <div className="sm:col-span-full">
                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-100">Plan Description</label>
                                    <div className="mt-2">
                                        <textarea
                                            name="description"
                                            id="description"
                                            className="block w-full bg-gray-100 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={formData.description}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        />
                                        {errors['description'] && <p className="text-red-500">{errors['description']}</p>}
                                    </div>
                                </div>
                                {/* <div className="sm:col-span-3">
                                    <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-100">Currency</label>
                                    <div className="mt-2 bg-gray-100">
                                        <select
                                            id="currency"
                                            name="currency"
                                            className="block w-full bg-gray-100 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        >
                                            <option value={'usd'}>Dollar</option>
                                        </select>
                                        {errors['currency'] && <p className="text-red-500">{errors['currency']}</p>}
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="bill_cycle" className="block text-sm font-medium leading-6 text-gray-100">Bill Cycle</label>
                                    <div className="mt-2 bg-gray-100">
                                        <select
                                            id="bill_cycle"
                                            name="bill_cycle"
                                            className="block w-full bg-gray-100 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            value={formData.bill_cycle}
                                            onChange={handleChange}
                                            disabled={viewOnly}
                                        >
                                            <option value={'month'}>Monthly</option>
                                        </select>
                                        {errors['bill_cycle'] && <p className="text-red-500">{errors['bill_cycle']}</p>}
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div >
                        {!viewOnly &&
                            <div className="mt-6 flex items-center justify-center gap-x-6">
                                <button type="button" className="text-sm font-semibold leading-6 text-gray-100">Cancel</button>
                                <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PlanForm;
