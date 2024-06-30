"use client"
import React, { useEffect, useState } from 'react'
import Login from '@/components/AdminPanel/Login'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { verify } from '@/features/admin/adminSlice'
import { verifyAdminToken } from '@/api/authService/auth'
import Loading from '@/components/Loading/Loading'
function Page() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(() => {
        const token = Cookies.get('team-sync-admin-token')
        if (token) {
            verifyAdminToken(token).then(() => {
                dispatch(verify())
                router.push('/admin/dashboard')

            }).catch((error: any) => {
                console.log(error);

                setLoading(false)
                Cookies.remove('team-sync-user-token')

            })
        } else {
            setLoading(false)
        }

    }, [])
    return (
        <>
            {
                loading ? <Loading background='bg-dark'/> :
                    <Login />
            }
        </>
    )
}

export default Page