"use client";
import Login from '@/components/Login/Login'
import LoginLanding from '@/components/Login'
import React, { useEffect, useState } from 'react'
import UserLayout from '@/components/Layout/UserLayout'
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { verify } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';

interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}


function Page() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()
    const { name, verified, tenantId } = useSelector((state: RootState) => state.user)

    useEffect(() => {

        if (verified) {
            router.push('/')
        } else {
            setLoading(false)
        }

    }, [])
    return (
        <UserLayout>
            {
                loading ? <Loading /> :
                    <LoginLanding>
                        <Login />
                    </LoginLanding>
            }
        </UserLayout>
    )
}

export default Page