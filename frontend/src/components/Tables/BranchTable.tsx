"use client"
import { blockPlan, deletePlan, fetchPlans, unBlockPlan } from '@/api/subscriptionService/subscription';
import { deleteBranch, fetchBranches } from '@/api/tenantService/tenant';
import { blockUser, deleteUser, fetchUsers, unBlockUser } from '@/api/userService/user';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import { IBranches } from '@/interfaces/Branches';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';




const BranchTable: React.FC = () => {
    const [branches, setBranches] = useState<IBranches[]>([]);
    const [toogle, setToogle] = useState<boolean>(true);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchBranches().then((result) => {
            console.log(result);

            setBranches(result.data);
        }).catch((err) => {
            console.log(err);

            if (err.response.status === 401) {
                dispatch(logout())

                router.push('/login')
            }
        })
    }, [toogle]);


    const handleBlock = (id: string) => {
        // blockPlan(id).then(() => {
        //     setToogle(!toogle)
        // }).catch((err) => {
        //     if(err.response.status===401){
        //         dispatch(logout())

        //         router.push('/admin/login')
        //     }
        // })
    }

    const handleUnBlock = (id: string) => {
        // unBlockPlan(id).then(() => {
        //     setToogle(!toogle)
        // }).catch((err) => {
        //     if(err.response.status===401){
        //         dispatch(logout())

        //         router.push('/admin/login')
        //     }
        // })
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
                deleteBranch(id).then(() => {

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    setToogle(!toogle)

                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout())

                        router.push('/login')
                    }
                })

            }
        });


    }

    return (
        <div className="bg-gray-900 p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Branches</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input className="bg-gray-50 outline-none ml-1 block" type="text" name="search" id="search" placeholder="search..." />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        <Link href={'/dashboard/branches/register'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</Link>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        {
                            branches.length > 0 ?
                                <>
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className='text-center'>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Id
                                                </th>
                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Location
                                                </th>


                                                <th className="px-5 text-center py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>


                                        <tbody>
                                            {
                                                branches.map((branch, index) => (
                                                    <tr key={index}>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{branch.branch_id}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">{`${branch.location}`}</p>
                                                        </td>

                                                        <td className="px-5 py-5 border-b border-gray-200 bg-gray-800 text-sm">
                                                            <p className="text-gray-100 whitespace-no-wrap text-center">
                                                                <Link type="button" href={`/dashboard/branches/${branch._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>

                                                                <button type="button" onClick={() => handleDelete(branch._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>


                                    </table>
                                    <div className="px-5 py-5 bg-gray-600 border-t flex flex-col xs:flex-row items-center xs:justify-between">
                                        <span className="text-xs xs:text-sm text-gray-100">
                                            Showing 1 to {branches.length} of {branches.length} Entries
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

export default BranchTable;
