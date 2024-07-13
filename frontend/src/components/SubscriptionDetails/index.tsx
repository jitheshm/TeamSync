"use client"
import React, { useEffect, useState } from 'react'
import CompanyDetails from './CompanyDetails'
import { fetchSubscriptionForUser, cancelSubscription } from '@/api/subscriptionService/subscription'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { ISubscriptionDetails, ITenants } from '@/interfaces/subscription'
import SubscriptionDetails from './SubscriptionDetails'
import Swal from 'sweetalert2'

interface SubscriptionDetails { }

function Index() {

    const [data, setData] = useState<ISubscriptionDetails | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        fetchSubscriptionForUser().then((res) => {
            console.log(res);

            setData(res.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
                router.push('/login');
            }
        });
    }, [])

    const handleCancelSubscription = () => {
        setLoading(true);
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
                cancelSubscription(data?.subscription_id as string).then(() => {
                    setData(null);
                }).catch((err) => {
                    if (err.response.status === 401) {
                        dispatch(logout());
                        router.push('/login');
                    }
                }).finally(() => {
                    setLoading(false);
                });
            }
        });

    }

    return (
        <div>
            <div className='mt-10 text-end mr-20'>
                {data && (
                    <button
                        onClick={handleCancelSubscription}
                        disabled={loading}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {loading ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <CompanyDetails tenant={data?.tenant as ITenants | null} />
            <SubscriptionDetails subscription={data} />

        </div>
    )
}

export default Index
