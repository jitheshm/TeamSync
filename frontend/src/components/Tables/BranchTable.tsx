"use client"
import { deleteBranch, fetchBranches } from '@/api/tenantService/tenant';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { IBranches } from '@/interfaces/Branches';

const BranchTable: React.FC = () => {
    const [branches, setBranches] = useState<IBranches[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchBranches(searchTerm, page, limit).then((result) => {
            setBranches(result.data.data);
            setTotal(result.data.total);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [searchTerm, toggle, page, limit]);



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
                    setToggle(!toggle);
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/login');
                    }
                });
            }
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    return (
        <div className="p-8 rounded-md w-11/12 mt-20 mx-auto">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-100 font-semibold">Branches</h2>
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        <Link href="/dashboard/branches/create" className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</Link>
                    </div>
                </div>
            </div>

            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-12 text-center font-semibold text-white">
                        <div className="col-span-4">Id</div>
                        <div className="col-span-4">Location</div>
                        <div className="col-span-4">Actions</div>
                    </div>
                    {branches.length > 0 ? branches.map((branch, index) => (
                        <div key={index} className="bg-gray-700 p-6 rounded-lg text-center shadow-lg grid grid-cols-12">
                            <div className="col-span-4">
                                <p className="text-white">{branch.branch_id}</p>
                            </div>
                            <div className="col-span-4">
                                <p className="text-white">{branch.location}</p>
                            </div>
                            <div className="col-span-4 ">
                                <button type="button" onClick={() => handleDelete(branch.branch_id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                            </div>
                        </div>
                    )) : <Empty />}
                </div>
            </div>
            <div className="flex justify-center gap-5 items-center py-4">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-800 text-white rounded-md">Previous</button>
                <span className="text-white">Page {page}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={(page * limit) >= total} className="px-4 py-2 bg-gray-800 text-white rounded-md">Next</button>
            </div>
        </div>
    );
};

export default BranchTable;
