"use client"
import React, { useEffect, useState } from 'react'
import CompanyDetails from './CompanyDetails'
import { fetchSubscriptionForUser } from '@/api/subscriptionService/subscription'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { ISubscriptionDetails, ITenants } from '@/interfaces/subscription'
import SubscriptionDetails from './SubscriptionDetails'


interface SubscriptionDetails {

}

function Index() {

    const [data, setData] = useState<ISubscriptionDetails | null>(null)
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

    return (
        <div>
            <CompanyDetails tenant={data?.tenant as ITenants | null} />
            <SubscriptionDetails subscription={data} />
        </div>
    )
}

export default Index