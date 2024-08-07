"use client";
import { blockPlan, deletePlan, fetchPlans, unBlockPlan } from '@/api/subscriptionService/subscription';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/admin/adminSlice';
import { ThemeState } from '@/features/theme/themeSlice';
import { IPlan } from '@/interfaces/subscription';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

interface RootState {
    theme: ThemeState;
}

const PlansTable: React.FC = () => {
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [toogle, setToogle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        fetchPlans(search,page,limit).then((result) => {
            setPlans(result.data.data);
            setTotal(result.data.total);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/admin/login');
            }
        });
    }, [toogle, search, page, limit]);

    const handleBlock = (id: string) => {
        blockPlan(id).then(() => {
            setToogle(!toogle);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/admin/login');
            }
        });
    };
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleUnBlock = (id: string) => {
        unBlockPlan(id).then(() => {
            setToogle(!toogle);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/admin/login');
            }
        });
    };

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
                    setToogle(!toogle);
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/admin/login');
                    }
                });
            }
        });
    };

    return (
        <div className="w-11/12 mb-8 mt-6 overflow-hidden rounded-lg">
            <h1 className={`font-semibold text-xl my-8 py-2 text-center ${dark ? 'bg-violet-800' : 'bg-gray-100'} rounded-lg`}>
                Plans
            </h1>
            <div className='mb-8 flex justify-between items-center'>
                <form className="max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className={`block w-full p-4 ps-10 text-sm ${dark ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white' : 'text-gray-900 border border-gray-300 bg-gray-50'} rounded-lg`}
                            placeholder="Search Plans"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className="space-x-8">
                    <Link href={'/admin/dashboard/plans/register'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</Link>
                </div>
            </div>
            <div className="w-full overflow-x-auto shadow-lg">
                <table className={`min-w-[70rem] w-full whitespace-no-wrap ${dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                    <thead>
                        <tr className={`text-lg font-semibold tracking-wide text-left shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                            <th className="px-4 py-3 text-center">Id</th>
                            <th className="px-4 py-3 text-center">Plan Name</th>
                            <th className="px-4 py-3 text-center">Price</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-600 ${dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                        {plans.length > 0 ? (
                            plans.map((plan, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-center">{plan.plan_id}</td>
                                    <td className="px-4 py-3 text-center">{plan.name}</td>
                                    <td className="px-4 py-3 text-center">{plan.price} {plan.currency}</td>
                                    <td className="px-4 py-3 text-center">{!plan.active ? 'Blocked' : 'Active'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Link href={`/admin/dashboard/plans/${plan._id}`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">View</Link>
                                        {!plan.active ? (
                                            <button onClick={() => handleUnBlock(plan._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Unblock</button>
                                        ) : (
                                            <button onClick={() => handleBlock(plan._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Block</button>
                                        )}
                                        <button onClick={() => handleDelete(plan._id)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-3 text-center">
                                    <Empty />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className={`px-4 py-3 flex justify-between min-w-[70rem] w-full text-xs font-semibold tracking-wide shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                    <span className="text-xs xs:text-sm text-gray-100">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} Entries
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button onClick={() => handlePageChange(page - 1)} className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l" disabled={page === 1}>
                            Prev
                        </button>
                        <button onClick={() => handlePageChange(page + 1)} className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r" disabled={page * limit >= total}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default PlansTable;
