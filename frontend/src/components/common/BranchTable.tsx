"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { IBranches } from '@/interfaces/Branches';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { deleteBranch, fetchBranches } from '@/api/tenantService/tenant';
import { logout } from '@/features/user/userSlice';
import Link from 'next/link';
import MainButton from './Buttons/MainButton';
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from '@nextui-org/react';
import randomColor from 'randomcolor';
import fontColorContrast from 'font-color-contrast';
import MoreButton from './Buttons/MoreButton';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { useAlertDialog } from '@/hooks/useAlertDialog';

const BranchTable: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [branches, setBranches] = useState<IBranches[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const { confirm } = useAlertDialog();



    useEffect(() => {
        setLoading(true)
        fetchBranches(searchTerm, page, limit).then((result) => {

            setBranches(result.data.data);
            setTotal(result.data.total);
            setLoading(false)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [searchTerm, toggle, page, limit]);

    const handleDelete = async (id: string) => {
        const result = await confirm();
        if (result.isConfirm) {
            deleteBranch(id).then(() => {

                setToggle(!toggle);
            }).catch((err) => {
                if (err.response.status === 401) {
                    dispatch(logout());
                    router.push('/login');
                }
            });
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    return (
        <>
            <div className='p-5'>
                <div className='my-5 flex justify-between items-center'>
                    <p>
                        All Branches
                    </p>
                    <div>
                        <Input placeholder='Search Users' onChange={handleSearchChange} value={searchTerm} />
                    </div>

                    <div>
                        {
                            <Link href='/dashboard/branches/create' className='w-full text-end md:w-auto'>
                                <MainButton name='Add Branch' />
                            </Link>
                        }
                    </div>
                </div>
                <Table removeWrapper aria-label="Example static table with custom cells" className='bg-background md:p-10 rounded-lg md:border md:border-border'>
                    <TableHeader>
                        <TableColumn >ID</TableColumn>
                        <TableColumn >Location</TableColumn>
                        <TableColumn align="center">Actions</TableColumn>
                    </TableHeader>
                    {
                        !loading && branches.length > 0 ? (
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
                                {branches.map((branch, index) => {

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {branch.branch_id}
                                            </TableCell>
                                            <TableCell >

                                                {branch.location}

                                            </TableCell>

                                            <TableCell >
                                                <div className="relative flex items-center justify-center gap-2">
                                                    <Tooltip content="Details">
                                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                            <MoreButton>

                                                                <Link href={`/dashboard/branches/${branch._id}/edit`}>
                                                                    <DropdownMenuItem>
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuItem onClick={() => handleDelete(branch._id)}>
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
                        ) :
                            <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />} emptyContent={"No data found."}>{[]}</TableBody>
                    }
                </Table>
                {
                    !loading && total > 0 && <div className='flex justify-center mt-2 h-1/6'>

                        <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" onChange={handlePageChange} />
                    </div>
                }
            </div>
        </>
    )
}

export default BranchTable