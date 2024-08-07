"use client"

import React, { useEffect, useState } from 'react';
import ForgotPassword from '@/components/Login/ForgotPassword';
import Otp from '@/components/Login/Otp';
import LoginLanding from '@/components/Login';
import NewPassword from '@/components/Login/NewPassword';
import UserLayout from '@/components/Layout/UserLayout';
import { useSelector } from 'react-redux';
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


const Page: React.FC = () => {
    const [otpVisible, setOtpVisible] = useState(false);
    const [passwordPage, setPasswordPage] = useState(false)
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true)
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
                        {otpVisible ? <Otp setOtpVisible={setOtpVisible} setPasswordPage={setPasswordPage} email={email} context='forgot-password' /> : passwordPage ? <NewPassword /> : <ForgotPassword setOtpVisible={setOtpVisible} setEmail={setEmail} />}
                    </LoginLanding>
            }
        </UserLayout>
    );
};

export default Page;
