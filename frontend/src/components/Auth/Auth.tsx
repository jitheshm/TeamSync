"use client"
import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { verify } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import Loading from '../Loading/Loading';


interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}

interface AuthProps {
    children: ReactNode
}

function Auth({ children }: AuthProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const { name, verified, tenantId } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (verified) {
            setLoading(false)
        } else {
            
            router.push('/login')
        }
    }, [verified])

    return (
        <>
            {loading ? <Loading /> : children}
        </>
    )
}

export default Auth