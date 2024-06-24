"use client";
import Login from '@/components/Login/Login'
import LoginLanding from '@/components/Login'
import React, { useEffect, useState } from 'react'
import UserLayout from '@/components/Layout/UserLayout'
import Cookies from 'js-cookie';
import instance from '@/axios';
import { verifyToken } from '@/api/authService/auth';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';


function Page() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(() => {
        const token = Cookies.get('team-sync-user-token')
        if (token) {
            verifyToken(token).then((data) => {
                dispatch(verify({ name: data.user }))
                router.push('/')

            }).catch((error) => {
                console.log(error);

                setLoading(false)
                Cookies.remove('team-sync-user-token')

            })
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