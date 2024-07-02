"use client"
import UserLayout from '@/components/Layout/UserLayout'
import TenantForm from '@/components/TenantForm/TenantForm'
import React, { useEffect, useState } from 'react'
import Payment from '@/components/Stripe/Payment'
import Auth from '@/components/Auth/Auth'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading/Loading'

interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}

function Page({ params }: { params: { planId: string } }) {

    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { name, verified, tenantId } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (verified) {
            if (tenantId) {
                router.push('/dashboard')

            } else {
                setLoading(false)

            }
        } else {
            router.push('/login')
        }

    }, [])
    return (

        <UserLayout>

            {
                loading ? <Loading /> : <TenantForm planId={params.planId} />
            }

        </UserLayout>


    )
}

export default Page