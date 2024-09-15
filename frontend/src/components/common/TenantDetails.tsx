"use client"
import { fetchSubscriptionForUser } from '@/api/subscriptionService/subscription';
import { logout } from '@/features/user/userSlice';
import { ITenants } from '@/interfaces/subscription';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function TenantDetails() {
    const [data, setData] = useState<ITenants | null>(null)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchSubscriptionForUser().then((res) => {
            console.log(res);

            setData(res.data?.tenant)

        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [])

    return (
        <div className="md:px-16 mt-10">

            <p>Tenant Details</p>

            <div className="mt-3 mb-8 border border-border p-5 rounded-lg w-full">
                <div className=" flex flex-wrap justify-between md:gap-0 ">
                    <div className="w-full md:w-4/12 flex flex-col gap-5">
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Tenant Id</p>
                            <p>{data?._id}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Company Name</p>
                            <p>{data?.company_name}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Company Type</p>
                            <p>{data?.company_type}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Phone No</p>
                            <p>{data?.phone_no }</p>
                        </div>

                    </div>

                    <div className="w-full md:w-4/12 flex flex-col gap-5">
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Domain</p>
                            <p>{data?.domain}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Register Date</p>
                            <p>{data ? new Date(data.register_date).toLocaleDateString() : ""}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Building No</p>
                            <p>{data?.address.building_no}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">City</p>
                            <p>{data?.address.city}</p>
                        </div>
                        
                    </div>


                    <div className="w-full md:w-4/12 flex flex-col gap-5">
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Street</p>
                            <p>{data?.address.street}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">State</p>
                            <p>{data?.address.state}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Country</p>
                            <p>{data?.address.country}</p>
                        </div>
                        <div>
                            <p className="dark:text-gray-400 text-gray-500">Postal Code</p>
                            <p>{data?.address.postal_code}</p>
                        </div>


                    </div>
                </div>
            </div>















        </div>
    )
}

export default TenantDetails