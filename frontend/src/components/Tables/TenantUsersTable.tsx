"use client";

import { fetchTenantUsers, tenantUserDelete } from '@/api/userService/user';
import Empty from '@/components/Empty/Empty';
import { ThemeState } from '@/features/theme/themeSlice';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    branch_id: string;
    branch_location: string;
}

interface UserState {
    name: string;
    verified: boolean;
    tenantId: string;
    id: string;
}

interface RootState {
    user: UserState;
    theme: ThemeState;
}

const TenantUsersTable: React.FC<{ admin: boolean }> = ({ admin = false }) => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [role, setRole] = useState(admin ? '' : 'Tester');
    const router = useRouter();
    const dispatch = useDispatch();
    const { id, verified } = useSelector((state: RootState) => state.user);
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        setPage(1);
    }, [search, role]);

    useEffect(() => {
        fetchTenantUsers(role, search, page, limit).then((result: any) => {
            console.log(result);

            setUsers(result.data.data);
            setTotal(result.data.total);
        }).catch((err: any) => {
            console.log(err);
            
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [toggle, search, page, limit,role]);

    const handleDelete = (branchId: string, id: string, role: string) => {
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
                tenantUserDelete(branchId, id, role).then(() => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The user has been deleted.",
                        icon: "success"
                    });
                    setToggle(!toggle);
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/employee/login');
                    }
                });
            }
        });
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="w-11/12 mb-8 mt-6 overflow-hidden rounded-lg">
            <h1 className={`font-semibold text-xl my-8 py-2 text-center bg-violet-800 rounded-lg flex w-full px-14 bg-gray-100`}>
                Tenant Users
            </h1>
            <div className='mb-8 flex justify-between items-center'>
                <form className="max-w-md">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className={`block w-full p-4 ps-10 text-sm ${dark ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white' : 'text-gray-900 border border-gray-300 bg-gray-50'} rounded-lg`} placeholder="Search Users" onChange={(e) => setSearch(e.target.value)} value={search} required />
                    </div>
                </form>
                <div className="pb-6 mt-7 md:mt-0">
                    <label htmlFor="role" className="text-gray-100 font-semibold mr-4">Role:</label>
                    <select
                        id="role"
                        className="bg-gray-50 outline-none p-2 rounded-md text-gray-950"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {admin && <option value="">All</option>}
                        {admin && <option value="Manager">Manager</option>}
                        <option value="Project_Manager">Project_Manager</option>
                        <option value="Developer">Developer</option>
                        <option value="Tester">Tester</option>
                    </select>
                </div>
                <div className="lg:ml-40 ml-10 space-x-8">
                    <Link href={admin ? '/dashboard/users/register' : '/employee/manager/dashboard/users/register'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                        Create User
                    </Link>
                </div>
               
            </div>
            <div className="w-full overflow-x-auto shadow-lg">
                <table className="min-w-[70rem] w-full whitespace-no-wrap">
                    <thead>
                        <tr className={`text-lg font-semibold tracking-wide text-left shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                            <th className="px-4 py-3 text-center">Name</th>
                            <th className="px-4 py-3 text-center">Email</th>
                            <th className="px-4 py-3 text-center">Role</th>
                            <th className="px-4 py-3 text-center">Branch</th>
                            <th className="px-4 py-3 text-center">Created At</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-600 ${!dark ? 'bg-gray-100 text-gray-950 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-center">{user.name}</td>
                                    <td className="px-4 py-3 text-center">{user.email}</td>
                                    <td className="px-4 py-3 text-center">{user.role}</td>
                                    <td className="px-4 py-3 text-center">{user.branch_location}</td>
                                    <td className="px-4 py-3 text-center">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-2 py-3 text-center">
                                    <Link href={admin ? `/dashboard/users/${user._id}/edit` : `/employee/manager/dashboard/users/${user._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>
                                    <button type="button" onClick={() => handleDelete(user.branch_id, user._id, user.role as string)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-3 text-center">
                                    <Empty />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className={`grid px-4 py-3 min-w-[70rem] w-full text-xs font-semibold tracking-wide shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : "bg-[#1A1C23] text-gray-300 border-t border-gray-700"} sm:grid-cols-9`}>
                    <span className="flex items-center col-span-3">
                        Showing {page} of {Math.ceil(total / limit)} pages
                    </span>
                    <div className="col-span-4"></div>
                    <span className="flex col-span-2 mt-2 sm:mt-auto sm:justify-end">
                        <nav aria-label="Table navigation">
                            <ul className="inline-flex items-center">
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:ring"
                                        aria-label="Previous"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                    >
                                        <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                            <path d="M7.05 10l4.95-4.95-1.41-1.41L3.24 10l7.34 7.36 1.41-1.41L7.05 10z" />
                                        </svg>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:ring"
                                        aria-label="Next"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === Math.ceil(total / limit)}
                                    >
                                        <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                                            <path d="M12.95 10l-4.95 4.95 1.41 1.41L16.76 10l-7.34-7.36-1.41 1.41L12.95 10z" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TenantUsersTable;
