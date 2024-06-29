"use client"
import { blockPlan, deletePlan, fetchPlans, unBlockPlan } from '@/api/subscriptionService/subscription';
import { blockUser, deleteUser, fetchUsers, unBlockUser } from '@/api/userService/user';
import Empty from '@/components/Empty/Empty';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface IFeatures {
    branches: number;
    meetings: number;
    support: 'basic' | 'expert';
}

interface IPlans {
    _id: string;
    plan_id: string;
    stripe_plan_id: string;
    description: string;
    bill_cycle: 'month' | 'year';
    features: IFeatures;
    price: string;
    name: string;
    currency: 'usd';
    created_at: Date;
    active: boolean;
    is_deleted: boolean;


}
const PlansTable: React.FC = () => {
    const [plans, setPlans] = useState<IPlans[]>([]);
    const [toogle, setToogle] = useState<boolean>(true);

    useEffect(() => {
        fetchPlans().then((result) => {
            console.log(result);

            setPlans(result.data);
        }).catch(() => {
            console.log("error");

        })
    }, [toogle]);


    const handleBlock = (id: string) => {
        blockPlan(id).then(() => {
            setToogle(!toogle)
        })
    }

    const handleUnBlock = (id: string) => {
        unBlockPlan(id).then(() => {
            setToogle(!toogle)
        })
    }

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deletePlan(id).then(() => {

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    setToogle(!toogle)

                }).catch(() => {
                    console.log("error");

                })

            }
        });


    }

    return (
        <div className="bg-gray-900 p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Plans</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input className="bg-gray-50 outline-none ml-1 block" type="text" name="search" id="search" placeholder="search..." />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        <Link href={'/admin/dashboard/plans/register'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</Link>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        {
                            plans.length > 0 ?
                                <>
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className='text-center'>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Id
                                                </th>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Plan Name
                                                </th>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>


                                        <tbody>
                                            {
                                                plans.map((plan, index) => (
                                                    <tr key={index}>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{plan.plan_id}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{`${plan.name}`}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{plan.price} {plan.currency}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{!plan.active ? 'Blocked' :  'Active' }</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">
                                                                <Link type="button" href={`/admin/dashboard/users/${plan._id}`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">view</Link>
                                                                {
                                                                    !plan.active ?
                                                                        <button type="button" onClick={() => handleUnBlock(plan._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Unblock</button>
                                                                        :
                                                                        <button type="button" onClick={() => handleBlock(plan._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Block</button>
                                                                }
                                                                <button type="button" onClick={() => handleDelete(plan._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>


                                    </table>
                                    <div className="px-5 py-5 bg-gray-600 border-t flex flex-col xs:flex-row items-center xs:justify-between">
                                        <span className="text-xs xs:text-sm text-gray-100">
                                            Showing 1 to {plans.length} of 50 Entries
                                        </span>
                                        <div className="inline-flex mt-2 xs:mt-0">
                                            <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                                                Prev
                                            </button>
                                            &nbsp; &nbsp;
                                            <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                                :
                                <Empty />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlansTable;
