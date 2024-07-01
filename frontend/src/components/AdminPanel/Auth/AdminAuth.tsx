"use client"
import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { verifyAdminToken } from '@/api/authService/auth'
import { verify } from '@/features/admin/adminSlice'
import Loading from '@/components/Loading/Loading'



interface AdminState {

    verified: boolean
}

interface RootState {
    admin: AdminState
}

interface AuthProps {
    children: ReactNode
}

function AdminAuth({ children }: AuthProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const { verified } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {

        if (verified) {
            setLoading(false)
        } else {
            // const token = Cookies.get('team-sync-admin-token')
            // if (token) {
            //     verifyAdminToken(token).then((data) => {
            //         dispatch(verify())
            //         setLoading(false)

            //     }).catch((error) => {
            //         console.log(error);
            //         router.push('/admin/login')



            //     })
            // } else {
            //     router.push('/admin/login')
            // }
            router.push('/admin/login')
        }

    }, [])

    return (
        <>
            {loading ? <Loading background='bg-dark' /> : children}
        </>
    )
}

export default AdminAuth