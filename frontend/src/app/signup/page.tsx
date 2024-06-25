"use client"
import SignUp from '@/components/Login/SignUp'
import LoginLanding from '@/components/Login'
import React, { useEffect, useState } from 'react'
import UserLayout from '@/components/Layout/UserLayout'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { verifyToken } from '@/api/authService/auth'
import { verify } from '@/features/user/userSlice'
import Cookies from 'js-cookie'
import Loading from '@/components/Loading/Loading'
import Otp from '@/components/Login/Otp'

function Page() {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()
    const [otpPage, setOtpPage] = useState(false)
    const [email, setEmail] = useState('')
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
                        {
                            otpPage ? <Otp context='signup' email={email} /> : <SignUp setOtpPage={setOtpPage} setEmail={setEmail}/>
                        }
                    </LoginLanding>
            }
        </UserLayout>
    )
}

export default Page