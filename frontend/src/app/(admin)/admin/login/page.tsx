"use client"
import React, { useEffect, useState } from 'react'
import Login from '@/components/AdminPanel/Login'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { verify } from '@/features/admin/adminSlice'
import Loading from '@/components/Loading/Loading'

interface AdminState {
    verified: boolean
}

interface RootState {
    admin: AdminState
}

function Page() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()
    const { verified } = useSelector((state: RootState) => state.admin)
    useEffect(() => {
        if (verified) {
            router.push('/admin/dashboard')
        } else {
            setLoading(false)
        }

    }, [])
    return (
        <>
            {
                loading ? <Loading background='bg-dark' /> :
                    <Login />
            }
        </>
    )
}

export default Page