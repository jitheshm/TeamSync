"use client"
import { blockUser, deleteUser, fetchUsers, unBlockUser } from '@/api/userService/user';
import Empty from '@/components/Empty/Empty';
import { logout } from '@/features/admin/adminSlice';
import { ThemeState } from '@/features/theme/themeSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

interface IUsers {
    _id: string;
    first_name: string;
    user_id: string;
    last_name: string;
    email: string;
    authentication_id: string;
    authentication_provider: string;
    stripe_customer_id: string;
    created_at: Date;
    phone_no: string | null;
    is_blocked: boolean;
    is_deleted: boolean;
    is_verified: boolean;
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
const UserTable: React.FC = () => {
    const [users, setUsers] = useState<IUsers[]>([]);
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
        fetchUsers(search, page, limit).then((result) => {
            console.log(result);

            setUsers(result.data.data);
            setTotal(result.data.total);

        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout())

                router.push('/admin/login')
            }

        })
    }, [toogle, search, page, limit]);


    const handleBlock = (id: string) => {
        blockUser(id).then(() => {
            setToogle(!toogle)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout())

                router.push('/admin/login')
            }
        })
    }

    const handleUnBlock = (id: string) => {
        unBlockUser(id).then(() => {
            setToogle(!toogle)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout())

                router.push('/admin/login')
            }
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
                deleteUser(id).then(() => {

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    setToogle(!toogle)

                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout())

                        router.push('/admin/login')
                    }
                })

            }
        })


    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="w-11/12 mb-8 mt-6 overflow-hidden  rounded-lg">

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



            </div>
            <div className="w-full overflow-x-auto h-[400px]  shadow-lg mt-20 mx-10 ">
                <table className="min-w-[70rem]  w-full whitespace-no-wrap h-fit">
                    <thead>
                        <tr className={`text-lg font-semibold tracking-wide text-left shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                            <th className="px-4 py-3 text-center">Id</th>
                            <th className="px-4 py-3 text-center">Name</th>
                            <th className="px-4 py-3 text-center">Email</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y  divide-gray-600 ${!dark ? 'bg-gray-100 text-gray-950 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                        {users.length > 0 ? (
                            users.map((user, index) => (

                                <tr key={index}>
                                    <td className="px-4 py-3 text-center">{user.user_id}</td>
                                    <td className="px-4 py-3 text-center">{`${user.first_name} ${user?.last_name}`}</td>
                                    <td className="px-4 py-3 text-center">{user.email}</td>
                                    <td className="px-4 py-3 text-center">{user.is_blocked ? 'Blocked' : user.is_verified ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Link href={`/admin/dashboard/users/${user._id}`} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View</Link>
                                        {user.is_blocked ? (
                                            <button onClick={() => handleUnBlock(user._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Unblock</button>
                                        ) : (
                                            <button onClick={() => handleBlock(user._id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Block</button>
                                        )}
                                        <button onClick={() => handleDelete(user._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
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

export default UserTable;
