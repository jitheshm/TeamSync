"use client"
import Loading from '@/components/Loading/Loading'
import Login from '@/components/TenantUserPanel/Login/Login'
import Otp from '@/components/TenantUserPanel/Login/Otp'
import Tenant from '@/components/TenantUserPanel/Login/Tenant'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


interface UserState {
    name: string
    verified: boolean
    tenantId: string
    role: string
}

interface RootState {
    user: UserState
}


function Page() {
    const [loading, setLoading] = useState(true)

    const [tenantId, setTenantId] = useState('')
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState(false)
    const [otpPage, setOtpPage] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const { name, verified, role } = useSelector((state: RootState) => state.user)


    useEffect(() => {

        if (verified) {
            switch (role) {
                case 'Manager':
                    router.push('/employee/manager/dashboard')
                    break
                case 'Project Manager':
                    router.push('/employee/project-manager/dashboard')
                    break
                case 'Developer':
                    router.push('/employee/developer/dashboard')
                    break
                case 'Tester':
                    router.push('/employee/tester/dashboard')
                    break
                default:
                    dispatch(logout())
                    setLoading(false)
                    break;
            }

        } else {
            setLoading(false)
        }

    }, [])
    return (


        <>
            {
                loading ? <Loading /> : otpPage ? <Otp email={email} tenantId={tenantId} /> : login ? <Login tenantId={tenantId} setEmail={setEmail} setOtpPage={setOtpPage} /> : <Tenant setLogin={setLogin} setTenantId={setTenantId} />
            }
        </>
    )
}

export default Page