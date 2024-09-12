"use client"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Tooltip,
    Avatar,
    Pagination,
    Spinner
} from "@nextui-org/react";
import MoreButton from './Buttons/MoreButton';
import Link from 'next/link';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import fontColorContrast from 'font-color-contrast';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchTenantUsers, tenantUserDelete } from '@/api/userService/user';
import { logout } from '@/features/user/userSlice';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { SelectComponent } from './Buttons/Select';
import MainButton from './Buttons/MainButton';
import { Input } from '../ui/input';
import { getColorForLetter } from '@/utils/dpColor';

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
}

function TenantUserTable({ admin = false, options }: { admin: boolean, options: { name: string, value: string }[] }) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<IUser[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);  // New state for debounced search
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [role, setRole] = useState(admin ? '' : 'Developer');
    const router = useRouter();
    const dispatch = useDispatch();
    const { id, verified } = useSelector((state: RootState) => state.user);
    const { confirm } = useAlertDialog();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);  

        return () => clearTimeout(delayDebounceFn);  
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, role]);

    useEffect(() => {
        setLoading(true);
        fetchTenantUsers(role, debouncedSearch, page, limit).then((result: any) => {
            setUsers(result.data.data);
            setTotal(result.data.total);
            setLoading(false);
        }).catch((err: any) => {
            if (err.response?.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [toggle, debouncedSearch, page, limit, role]);

    const handleDelete = async (branchId: string, id: string, role: string) => {
        const result = await confirm();
        if (result.isConfirm) {
            tenantUserDelete(branchId, id, role).then(() => {
                setToggle(!toggle);
            }).catch((err) => {
                if (err.response.status === 401) {
                    dispatch(logout());
                    router.push('/employee/login');
                }
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSelectChange = (value: string) => {
        setRole(value);
    };

    return (
        <>
            <div>
                <div className='my-5 flex justify-between items-center'>
                    <p>All Users</p>
                    <div>
                        <Input placeholder='Search Users' onChange={(e) => setSearch(e.target.value)} value={search} />
                    </div>
                    <div>
                        <SelectComponent placeholder='Select a User' active={role} options={options} handleValueChange={handleSelectChange} />
                    </div>
                    <div>
                        <Link href={admin ? '/dashboard/users/register' : '/employee/manager/dashboard/users/register'} className='w-full text-end md:w-auto'>
                            <MainButton name='Add User' />
                        </Link>
                    </div>
                </div>
                <Table removeWrapper aria-label="Example static table with custom cells" className='bg-background md:p-10 rounded-lg md:border md:border-border'>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Branch</TableColumn>
                        <TableColumn>Role</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    {
                        !loading && users.length > 0 ? (
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
                                {users.map((user, index) => {
                                    const initial = user.name.charAt(0).toUpperCase();
                                    const { bgColor, textFont } = getColorForLetter(initial);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <User
                                                    avatarProps={{
                                                        radius: "lg",
                                                        style: {
                                                            fontSize: "20px",
                                                            backgroundColor: bgColor,
                                                            color: textFont,
                                                            fontWeight: 'bold'
                                                        },
                                                        name: initial
                                                    }}
                                                    name={user.name}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">{user.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">{user.branch_location}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">{user.role}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative flex items-center justify-center gap-2">
                                                    <Tooltip content="More">
                                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                            <MoreButton>
                                                                <Link href={admin ? `/dashboard/users/${user._id}/edit` : `/employee/manager/dashboard/users/${user._id}/edit`}>
                                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuItem onClick={() => handleDelete(user.branch_id, user._id, user.role)}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </MoreButton>
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        ) : (
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />} emptyContent={"No data found."}>{[]}</TableBody>
                        )
                    }
                </Table>
                {
                    !loading && total > 0 && <div className='flex justify-center mt-2 h-1/6'>
                        <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" onChange={handlePageChange} />
                    </div>
                }
            </div>
        </>
    );
}

export default TenantUserTable;
