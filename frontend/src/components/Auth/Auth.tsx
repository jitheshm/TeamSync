import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { verifyToken } from '@/api/authService/auth';
import { verify } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';
import Loading from '../Loading/Loading';


interface UserState {
    name: string
    verified: boolean
}

interface RootState {
    user: UserState
}

interface AuthProps {
    children: ReactNode
}

function Auth({ children }: AuthProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const { name, verified } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (verified) {
            setLoading(false)
        } else {
            const token = Cookies.get('team-sync-user-token')
            if (token) {
                verifyToken(token).then((data) => {
                    dispatch(verify({ name: data.user }))
                    setLoading(false)

                }).catch((error) => {
                    console.log(error);
                    router.push('/login')



                })
            } else {
                router.push('/login')
            }
        }
    }, [verified])

    return (
        <>
            {loading ? <Loading/> : children}
        </>
    )
}

export default Auth