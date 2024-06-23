"use client"

import React, { useState } from 'react';
import ForgotPassword from '@/components/Login/ForgotPassword';
import Otp from '@/components/Login/Otp';
import LoginLanding from '@/components/Login/landing';
import NewPassword from '@/components/Login/NewPassword';


const Page: React.FC = () => {
    const [otpVisible, setOtpVisible] = useState(false);
    const [passwordPage, setPasswordPage] = useState(false)

    return (
        <LoginLanding>
            {otpVisible ? <Otp /> : passwordPage ? <NewPassword /> : <ForgotPassword />}
        </LoginLanding>
    );
};

export default Page;
