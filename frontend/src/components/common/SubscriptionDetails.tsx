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
import TransactionTable from './TransactionTable'
import MainButton from './Buttons/MainButton'
import { SelectComponent } from './Buttons/Select'


interface IPlans {
    id: string;
    name: string;
    stripe_plan_id: string

}

function SubscriptionDetails() {

    const [data, setData] = useState<ISubscriptionDetails | null>(null)
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

    const handlePlanChange = (value: string) => {

        setSelectedPlan(value);

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


    return (
        <>
            <div className='p-4 lg:p-0'>


                {
                    data &&
                    <>
                        <div className="md:px-16 mt-10">
                            {/* <p>Company Details</p>
                        <Details data={data?.tenant as ITenants} /> */}
                            <div className='text-center'>
                                <p className='font-semibold'>Subscription Details</p>
                            </div>

                            <div className="mt-3 mb-8 md:border border-border p-5 rounded-lg w-full">
                                <div className=" flex flex-wrap justify-between md:gap-0 gap-5">
                                    <div className="w-full md:w-6/12 lg:w-4/12 flex flex-col gap-5">
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Subscription Id</p>
                                            <p>{data.subscription_id}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Plan Name</p>
                                            <p>{data.plan.name}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Invoice Id</p>
                                            <p>{data.stripe_latest_invoice}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Renewal Date</p>
                                            <p>{new Date(data.renewal_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Status</p>
                                            <p>{data.status}</p>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-6/12 lg:w-4/12 flex flex-col gap-5">
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Payment Method</p>
                                            <p>{data.payment_method}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Bill Cycle</p>
                                            <p>{data.plan.bill_cycle}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Price</p>
                                            <p>{data.plan.price}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Currency</p>
                                            <p>{data.plan.currency}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Start Date</p>
                                            <p>{new Date(data.start_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>


                                    <div className="w-full md:w-6/12 lg:w-4/12 flex flex-col gap-5">
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Max Branches</p>
                                            <p>{data.plan.features.branches}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Meeting Limit</p>
                                            <p>{data.plan.features.meetings}</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-gray-400 text-gray-500">Support</p>
                                            <p>{data.plan.features.support}</p>
                                        </div>


                                    </div>
                                </div>
                            </div>














                            {
                                clientSecret && (
                                    <Payment clientSecret={clientSecret} theme={"night"} />
                                )
                            }
                        </div>
                    </>
                }

                <div className='md:px-16 mt-10 text-end  flex gap-10 flex-wrap-reverse '>
                    {data && data.status !== 'cancelled' && data.status != 'pending' && data.status != 'failed' && (
                        <>
                            <MainButton
                                onClick={handleCancelSubscription}
                                name='Cancel Subscription'
                                className='bg-red-700 hover:bg-red-600 text-white'

                            />
                            {
                                (plans[plans.length - 1]?.stripe_plan_id != data.plan_id || data.status != 'canceled') &&
                                <div className='flex gap-5 flex-wrap'>
                                    <SelectComponent
                                        placeholder=''
                                        active={selectedPlan!}
                                        options={plans.map((plan) => ({ name: plan.name, value: plan.stripe_plan_id }))}
                                        handleValueChange={handlePlanChange}
                                    />


                                    <MainButton
                                        onClick={handleUpdatePlan}
                                        // disabled={}
                                        className={`${data.plan_id != selectedPlan ? '' : 'invisible'}`}
                                        name='Update Plan'
                                    />

                                </div>
                            }

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
            </div>
        </>
    )
}

export default SubscriptionDetails