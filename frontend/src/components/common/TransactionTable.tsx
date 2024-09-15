"use client"
import { fetchSubscriptionForUser } from '@/api/subscriptionService/subscription';
import { logout } from '@/features/user/userSlice';
import { ITransaction } from '@/interfaces/subscription';
import { Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function TransactionTable() {
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchSubscriptionForUser().then((res) => {
            console.log(res);

            setTransactions(res.data.transactions)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [])
    return (
        <>
            <div className='p-5'>
                <div className='my-5 flex justify-between items-center'>
                    <p>
                        All Transactions
                    </p>

                </div>
                <Table removeWrapper aria-label="Example static table with custom cells" className='bg-background md:p-10 rounded-lg md:border md:border-border'>
                    <TableHeader>
                        <TableColumn >Transaction Id</TableColumn>
                        <TableColumn >Amount</TableColumn>
                        <TableColumn >Status</TableColumn>
                        <TableColumn >Date</TableColumn>
                    </TableHeader>
                    {
                        transactions.length > 0 ? (
                            <TableBody>
                                {transactions.sort((a, b) => {
                                    const dateA = new Date(a.date).getTime();
                                    const dateB = new Date(b.date).getTime();

                                    // Sort in descending order
                                    return dateB - dateA;

                                }).map((transaction, index) => {

                                    return (
                                        < TableRow key={index} >
                                            <TableCell>
                                                {transaction.transaction_id}
                                            </TableCell>
                                            <TableCell >

                                                {transaction.amount}

                                            </TableCell>
                                            <TableCell >

                                                {transaction.status}

                                            </TableCell>
                                            <TableCell >

                                                {new Date(transaction.date).toLocaleDateString()}

                                            </TableCell>


                                        </TableRow >
                                    );
                                })}
                            </TableBody>
                        ) :
                            <TableBody emptyContent={"No data found."}>{[]}</TableBody>
                    }
                </Table>
                {/* {
                     total > 0 && <div className='flex justify-center mt-2 h-1/6'>

                        <Pagination total={Math.ceil(total / limit)} initialPage={page} color="success" onChange={handlePageChange} />
                    </div>
                } */}
            </div>
        </>
    )
}

export default TransactionTable

