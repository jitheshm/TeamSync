"use client";
import { fetchTenantUsers, tenantUserDelete } from '@/api/userService/user';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export interface ITenantUsers {
    _id: string;
    email: string;
    created_at: string;
    name: string;
    tenant_user_id: string;
    role: string;
    branch_id: string;
    branch_location: string;
    phone_no: string;
}

const TenantUsersTable: React.FC<{ admin: boolean }> = ({ admin = false }) => {
    const [users, setUsers] = useState<ITenantUsers[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();
    const [role, setRole] = useState(admin ? '' : 'Tester');

    useEffect(() => {
        fetchTenantUsers(role,search).then((result: any) => {
            setUsers(result.data);
        }).catch((err: any) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/employee/login');
            }
        });
    }, [toggle, role, search]);

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

    return (
        <div className="p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Tenant Users</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input 
                            className="bg-gray-50 text-gray-950 outline-none ml-1 block" 
                            type="text" 
                            name="search" 
                            id="search" 
                            placeholder="search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        <Link href={admin ? '/dashboard/users/register' : '/employee/manager/dashboard/users/register'} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</Link>
                    </div>
                </div>
            </div>
            <div className="pb-6 mt-7 md:mt-0">
                <label htmlFor="role" className="text-gray-100 font-semibold mr-4">Role:</label>
                <select
                    id="role"
                    className="bg-gray-50 outline-none p-2 rounded-md text-gray-950"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    {admin && <option value="">All</option>}
                    <option value="Project_Manager">Project_Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Tester">Tester</option>
                </select>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-8 text-center font-semibold text-white">
                        <div className="col-span-1">Id</div>
                        <div className="col-span-1">Name</div>
                        <div className="col-span-1">Email</div>
                        <div className="col-span-1">Phone No</div>
                        <div className="col-span-1">Branch</div>
                        <div className="col-span-1">Role</div>
                        <div className="col-span-1">Created At</div>
                        <div className="col-span-1">Actions</div>
                    </div>
                    {users.length > 0 ? users.map((user, index) => (
                        <div key={index} className="bg-gray-700 p-6 rounded-lg text-center justify-stretch shadow-lg grid grid-cols-8">
                            <div className="col-span-1 ">
                                <div className="tooltip-container">
                                    <p className="text-white max-w-40  truncate">{user.tenant_user_id}</p>
                                    <span className="tooltip-text px-5 ">{user.tenant_user_id}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="tooltip-container">
                                    <p className="text-white truncate">{user.name}</p>
                                    <span className="tooltip-text">{user.name}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="tooltip-container">
                                    <p className="text-white truncate">{user.email}</p>
                                    <span className="tooltip-text">{user.email}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="tooltip-container">
                                    <p className="text-white truncate">{user.phone_no}</p>
                                    <span className="tooltip-text">{user.phone_no}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="tooltip-container">
                                    <p className="text-white truncate">{user.branch_location}</p>
                                    <span className="tooltip-text">{user.branch_location}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="tooltip-container">
                                    <p className="text-white truncate">{user.role}</p>
                                    <span className="tooltip-text">{user.role}</span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-1 flex space-x-2">
                                <Link href={admin ? `/dashboard/users/${user._id}/edit` : `/employee/manager/dashboard/users/${user._id}/edit`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</Link>
                                <button type="button" onClick={() => handleDelete(user.branch_id, user._id, user.role as string)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                            </div>
                        </div>
                    )) : <Empty />}
                </div>
            </div>
        </div>
    );
};

export default TenantUsersTable;
