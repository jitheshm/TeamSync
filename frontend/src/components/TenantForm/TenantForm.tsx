"use client";
import { register } from '@/api/tenantService/tenant';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { subscription } from '@/api/subscriptionService/subscription';
import Payment from '../Stripe/Payment';
import { logout } from '@/features/user/userSlice';
import { useDispatch } from 'react-redux';
import { errorModal } from '@/utils/alerts/errorAlert';
import { ScrollArea } from '../ui/scroll-area';

const addressSchema = z.object({
    building_no: z.string().trim().min(1, 'Building number is required'),
    city: z.string().trim().min(3, 'City must contain at least 3 letters'),
    country: z.string().trim().min(3, 'Country must contain at least 3 letters'),
    postal_code: z.string().trim().regex(/^\d+$/, 'Postal code must contain only digits'),
    state: z.string().trim().min(2, 'State must contain at least 2 letters'),
    street: z.string().trim().min(3, 'Street must contain at least 3 letters'),
});

const tenantSchema = z.object({
    company_name: z.string().trim().min(3, 'Company name must contain at least 3 letters'),
    company_type: z.string().trim().min(3, 'Company type must contain at least 3 letters'),
    address: addressSchema,
    phone_no: z.string().trim().regex(/^\d+$/, 'Phone number must contain only digits'),
    domain: z.string().trim().url('Invalid domain').optional().nullable(),
});

export interface TenantFormData {
    company_name: string;
    company_type: string;
    address: {
        building_no: string;
        city: string;
        country: string;
        postal_code: string;
        state: string;
        street: string;
    };
    phone_no: string;
    domain: string | null;
}

interface Errors {
    company_name?: { _errors: string[] };
    company_type?: { _errors: string[] };
    address?: {
        building_no?: { _errors: string[] };
        city?: { _errors: string[] };
        country?: { _errors: string[] };
        postal_code?: { _errors: string[] };
        state?: { _errors: string[] };
        street?: { _errors: string[] };
    };
    phone_no?: { _errors: string[] };
    domain?: { _errors: string[] };
    general?: string;
}

const TenantForm: React.FC<{ planId: string }> = ({ planId }) => {
    const [formData, setFormData] = useState<TenantFormData>({
        company_name: '',
        company_type: '',
        address: {
            building_no: '',
            city: '',
            country: '',
            postal_code: '',
            state: '',
            street: '',
        },
        phone_no: '',
        domain: null,
    });
    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter();
    const [paymentForm, setPaymentForm] = useState(false)
    const [clientSecret, setClientSecret] = useState("");
    const dispatch = useDispatch();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = tenantSchema.safeParse(formData);

        if (result.success) {
            setErrors({});
            try {
                const data = await register(formData);
                console.log(data);
                // router.push('/');
                const response = await subscription(data.tenantId, planId)
                setClientSecret(response.subscription.latest_invoice.payment_intent.client_secret)
                setPaymentForm(true)

            } catch (error: any) {
                if (error.response?.status === 401) {
                    dispatch(logout())

                    router.push('/login')
                }
                else {
                    errorModal(error.response.data.errors || error.response.data.error)
                }
            }
            console.log('Form data:', formData);
        } else {
            const formattedErrors = result.error.format();
            setErrors(formattedErrors);
        }
    };

    return (
        <div className='   text-gray-100'>
            <ScrollArea className="h-[calc(100vh_-_4rem)]">
                <div className='h-fit my-10'>
                    <div>
                        <h4 className="text-3xl font-bold tracki text-center mt-12 sm:text-4xl ">Tenant Registration</h4>
                    </div>
                    <form className='w-1/2 mx-auto mt-10 h-fit' onSubmit={handleSubmit}>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 ">Company Details</h2>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="company_name" className="block text-sm font-medium leading-6 ">Company name</label>
                                        <div className="mt-2">
                                            <input type="text" name="company_name" id="company_name" autoComplete="given-name" className="block w-full rounded-md border-0 py-1.5  shadow-sm bg-transparent ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.company_name} onChange={handleChange} placeholder='Enter the name'/>
                                            {errors.company_name && <span className="text-red-600 text-sm">{errors.company_name._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="company_type" className="block text-sm font-medium leading-6 ">Company type</label>
                                        <div className="mt-2">
                                            <input type="text" name="company_type" id="company_type" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.company_type} onChange={handleChange} placeholder='Enter the type' />
                                            {errors.company_type && <span className="text-red-600 text-sm">{errors.company_type._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="domain" className="block text-sm font-medium leading-6 ">Company domain</label>
                                        <div className="mt-2">
                                            <input type="text" name="domain" id="domain" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.domain || ''} onChange={handleChange} placeholder='Enter your domain'/>
                                            {errors.domain && <span className="text-red-600 text-sm">{errors.domain._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="phone_no" className="block text-sm font-medium leading-6 ">Phone Number</label>
                                        <div className="mt-2">
                                            <input type="text" name="phone_no" id="phone_no" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.phone_no} onChange={handleChange} placeholder='Enter your phone no'/>
                                            {errors.phone_no && <span className="text-red-600 text-sm">{errors.phone_no._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.country" className="block text-sm font-medium leading-6 ">Country</label>
                                        <div className="mt-2">
                                            <select id="address.country" name="address.country" autoComplete="country-name" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" value={formData.address.country} onChange={handleChange}>
                                                <option value={'United States'}>United States</option>
                                                <option value={'India'}>India</option>
                                            </select>
                                            {errors.address?.country && <span className="text-red-600 text-sm">{errors.address.country._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.street" className="block text-sm font-medium leading-6 ">Street</label>
                                        <div className="mt-2">
                                            <input type="text" name="address.street" id="address.street" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.address.street} onChange={handleChange} placeholder='Enter your street'/>
                                            {errors.address?.street && <span className="text-red-600 text-sm">{errors.address.street._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.building_no" className="block text-sm font-medium leading-6 ">Building Number</label>
                                        <div className="mt-2">
                                            <input type="text" name="address.building_no" id="address.building_no" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.address.building_no} onChange={handleChange} placeholder='Enter your building no' />
                                            {errors.address?.building_no && <span className="text-red-600 text-sm">{errors.address.building_no._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.city" className="block text-sm font-medium leading-6 ">City</label>
                                        <div className="mt-2">
                                            <input type="text" name="address.city" id="address.city" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.address.city} onChange={handleChange} placeholder='Enter your city' />
                                            {errors.address?.city && <span className="text-red-600 text-sm">{errors.address.city._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.state" className="block text-sm font-medium leading-6 ">State / Province</label>
                                        <div className="mt-2">
                                            <input type="text" name="address.state" id="address.state" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.address.state} onChange={handleChange} placeholder='Enter your state' />
                                            {errors.address?.state && <span className="text-red-600 text-sm">{errors.address.state._errors[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address.postal_code" className="block text-sm font-medium leading-6 ">ZIP / Postal code</label>
                                        <div className="mt-2">
                                            <input type="text" name="address.postal_code" id="address.postal_code" autoComplete="postal-code" className="bg-transparent block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={formData.address.postal_code} onChange={handleChange} placeholder='Enter your postal code' />
                                            {errors.address?.postal_code && <span className="text-red-600 text-sm">{errors.address.postal_code._errors[0]}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 mb-10 flex items-center justify-end gap-x-6">
                            <button type="button" className="text-sm font-semibold leading-6 ">Cancel</button>
                            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                        </div>
                    </form>
                    {
                        paymentForm && <Payment clientSecret={clientSecret} theme={'night'} />
                    }
                </div>
            </ScrollArea>
        </div>
    );
};

export default TenantForm;