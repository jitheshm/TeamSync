"use client"
import SignUp from '@/components/Login/SignUp'
import LoginLanding from '@/components/Login'
import React, { useEffect, useState } from 'react'
import UserLayout from '@/components/Layout/UserLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { verify } from '@/features/user/userSlice'
import Cookies from 'js-cookie'
import Loading from '@/components/Loading/Loading'
import Otp from '@/components/Login/Otp'


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
    const [otpPage, setOtpPage] = useState(false)
    const { verified } = useSelector((state: RootState) => state.user)

    const [email, setEmail] = useState('')
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
                        {
                            otpPage ? <Otp context='signup' email={email} /> : <SignUp setOtpPage={setOtpPage} setEmail={setEmail} />
                        }
                    </LoginLanding>
            }
        </UserLayout>
    )
}

export default Page