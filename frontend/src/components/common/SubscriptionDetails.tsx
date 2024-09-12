"use client"
import React, { useEffect, useState } from 'react'
import { fetchSubscriptionForUser, cancelSubscription, updateSubscriptionPlan, fetchPlans, fetchAvailablePlans, retryPayment } from '@/api/subscriptionService/subscription'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { ISubscriptionDetails, ITenants, ITransaction } from '@/interfaces/subscription'
import Swal from 'sweetalert2'
import { errorModal } from '@/utils/alerts/errorAlert'
import Payment from '../Stripe/Payment'
import Details from './Details'
import TransactionTable from './TransactionTable'


interface IPlans {
    id: string;
    name: string;
    stripe_plan_id: string

}

function SubscriptionDetails() {

    const [data, setData] = useState<ISubscriptionDetails | null>(null)
    const [transaction, setTransaction] = useState<ITransaction[]>([])
    const [error, setError] = useState<string | null>(null)
    const [plans, setPlans] = useState<IPlans[]>([])
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [toogle, setToogle] = useState<boolean>(true)
    const dispatch = useDispatch()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState<string | null>(null)



    useEffect(() => {
        fetchSubscriptionForUser().then((res) => {
            console.log(res);

            setData(res.data)
            setTransaction(res.data.transactions)
            setSelectedPlan(res.data.plan_id)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [toogle])

    useEffect(() => {
        fetchAvailablePlans().then((result) => {
            setPlans(result.data.data)
        }).catch((error: any) => {
            if (error.response.status === 401) {
                dispatch(logout())

                router.push('/login')
            }
        })
    }, [])

    const handleCancelSubscription = () => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {

            if (result.isConfirmed) {
                cancelSubscription(data?.stripe_subscription_id as string).then(() => {
                    // setData(null);
                    setToogle(!toogle)
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/login');
                    }
                })
            }
        });

    }

    const handlePlanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setSelectedPlan(event.target.value);

    }

    const handleUpdatePlan = () => {
        if (!selectedPlan) return;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {

            if (result.isConfirmed) {
                updateSubscriptionPlan(data?.stripe_subscription_id as string, data?.stripe_customer_id as string, selectedPlan).then(() => {
                    setToogle(!toogle)
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/login');
                    } else {
                        setError('Failed to update plan.');
                    }
                })
            }
        })
    }

    const handlePaymentRetry = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {

            if (result.isConfirmed) {
                retryPayment(data?.stripe_latest_invoice as string).then((res) => {
                    console.log(res.paymentIntent.client_secret);
                    setClientSecret(res.paymentIntent.client_secret)
                }).catch((err) => {
                    console.log(err)

                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/login');
                    } else {
                        errorModal(err.response.data.error)
                    }
                })
            }
        })
    }
    if (data) {

        var { transactions, tenant, plan, ...subDetails } = data
        subDetails.plan_id = plan.name

    }

    return (
        <>
            <div className='mt-10 text-end mr-20'>
                {data && data.status !== 'cancelled' && data.status != 'pending' && data.status != 'failed' && (
                    <>
                        <button
                            onClick={handleCancelSubscription}

                            className='mt-5 px-5 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 disabled:bg-red-300'
                        >
                            Cancel Subscription
                        </button>
                        <select
                            value={selectedPlan ?? ''}
                            onChange={handlePlanChange}
                            className='ml-5 px-4 py-2 border rounded text-gray-950'
                            disabled={plans[plans.length - 1]?.stripe_plan_id === data.plan_id || data.status === 'canceled'}
                        >
                            {plans.map(plan => (
                                <option key={plan.stripe_plan_id} value={plan.stripe_plan_id}>{plan.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdatePlan}
                            disabled={plans[plans.length - 1]?.stripe_plan_id === data.plan_id || data.status === 'canceled'}

                            className='ml-2 px-5 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 disabled:bg-blue-300'
                        >
                            Update Plan
                        </button>
                    </>
                )}
                {
                    data && (data.status === 'pending' || data.status === 'failed') && (
                        <>
                            <button
                                onClick={handlePaymentRetry}

                                className='mt-5 px-5 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 disabled:bg-red-300'
                            >
                                Retry Payment
                            </button>
                        </>
                    )
                }
                {error && <p className='text-red-500'>{error}</p>}
            </div>

            {
                data &&
                <>
                    <div className="md:px-16">
                        <p>Company Details</p>
                        <Details data={data?.tenant as ITenants} />
                        <p>Subscription Details</p>
                        <Details data={subDetails!} />
                        <TransactionTable transactions={transaction} />
                        {
                            clientSecret && (
                                <Payment clientSecret={clientSecret} theme={"night"} />
                            )
                        }
                    </div>
                </>
            }
        </>
    )
}

export default SubscriptionDetails