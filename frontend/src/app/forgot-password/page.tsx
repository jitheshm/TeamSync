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

    return (
        <UserLayout>
            <LoginLanding>
                {otpVisible ? <Otp /> : passwordPage ? <NewPassword /> : <ForgotPassword />}
            </LoginLanding>
        </UserLayout>
    );
};

export default Page;
