"use client"

import React, { useState } from 'react';
import ForgotPassword from '@/components/Login/ForgotPassword';
import Otp from '@/components/Login/Otp';
import LoginLanding from '@/components/Login';
import NewPassword from '@/components/Login/NewPassword';
import UserLayout from '@/components/Layout/UserLayout';


const Page: React.FC = () => {
    const [otpVisible, setOtpVisible] = useState(false);
    const [passwordPage, setPasswordPage] = useState(false)
    const [email, setEmail] = useState('');

    return (
        <UserLayout>
            <LoginLanding>
                {otpVisible ? <Otp setOtpVisible={setOtpVisible} setPasswordPage={setPasswordPage} email={email} /> : passwordPage ? <NewPassword email={email} /> : <ForgotPassword setOtpVisible={setOtpVisible} setEmail={setEmail} />}
            </LoginLanding>
        </UserLayout>
    );
};

export default Page;
