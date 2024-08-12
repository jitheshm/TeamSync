import { ITransaction } from '@/interfaces/subscription'
import React from 'react'
import Empty from '../Empty/Empty'
import { useSelector } from 'react-redux';
import { ThemeState } from '@/features/theme/themeSlice';

interface RootState {
    theme: ThemeState;
}

function Transactiion({ transactions }: { transactions: ITransaction[] }) {
    const { background, text, main, dark } = useSelector((state: RootState) => state.theme);

    return (
        <div className=" p-3 shadow-sm rounded-sm mt-5 w-11/12 mx-auto">
            <div className='my-1'>
                Transactions
            </div>
            <div className="w-full overflow-x-auto shadow-lg">
                <table className="min-w-[50rem] w-full whitespace-no-wrap">
                    <thead>
                        <tr className={`text-lg font-semibold tracking-wide text-left shadow uppercase ${main === 'bg-gray-100' ? 'bg-gray-100 text-gray-600 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                            <th className="px-4 py-3 text-center">Transaction Id</th>
                            <th className="px-4 py-3 text-center">Amount</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y  divide-gray-600 ${!dark ? 'bg-gray-100 text-gray-950 border border-gray-300' : 'bg-[#1A1C23] text-gray-300 border-b border-gray-700'}`}>
                        {transactions.length > 0 ? (
                            transactions.sort((a, b) => {
                                const dateA = new Date(a.date).getTime();
                                const dateB = new Date(b.date).getTime();

                                // Sort in descending order
                                return dateB - dateA;

                            }).map((transaction, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-center">{transaction.transaction_id}</td>
                                    <td className="px-4 py-3 text-center">{transaction.amount}</td>
                                    <td className="px-4 py-3 text-center">{transaction.status}</td>
                                    <td className="px-4 py-3 text-center">{new Date(transaction.date).toLocaleDateString()}</td>


                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-3 text-center">
                                    <Empty />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default Transactiion