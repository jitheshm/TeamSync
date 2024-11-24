import { resendOtp, verifyOtp } from '@/api/authService/auth';
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { z } from 'zod';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/user/userSlice';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"





interface OtpProps {
    setOtpVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setPasswordPage: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    context: string;
}

const Otp: React.FC<Partial<OtpProps>> = ({ setOtpVisible, setPasswordPage, email, context }) => {

    const [otp, setOtp] = useState('')
    const router = useRouter();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);


    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        } else {
            setIsResendDisabled(false);
        }
    }, [timer]);



    const handleChange = (value: string) => {
        setOtp(value)
    }

    const handleResendOtp = () => {
        const data = {
            email: email,
            context: context,
            tenantId: null,
        };
        resendOtp(data as { email: string; context: string; tenantId: string | null })
            .then(() => {
                console.log("OTP sent successfully");
                setTimer(30);
                setIsResendDisabled(true);
            })
            .catch(() => {
                console.log("An unexpected error occurred. Please try again later.");
            });
    };

    const handleSubmit = async () => {
       
        if (otp.length === 6) {
            try {
                const response = await verifyOtp(otp, email as string, context as string);
                if (context === "forgot-password" && setOtpVisible && setPasswordPage) {
                    Cookie.set('team-sync-token', response.token, { expires: 1 });
                    setOtpVisible(false);
                    setPasswordPage(true);
                } else {
                    Cookie.set('team-sync-token', response.token, { expires: 1 });

                    dispatch(verify({ name: response.name, tenantId: response.tenantId ?? '', role: response.role, id: response.id }));

                    // Redirect to home page   
                    router.push('/subscription-plans');
                }
            } catch (error) {
                console.log(error);
                setErrors(true);
            }
        } else {
            setErrors(true);
        }
    };

    return (
        <div className="w-3/4 p-4 mt-4  backdrop-blur-sm shadow-lg  md:border border-gray-700 rounded-lg  sm:p-6 md:p-8">

            <div className="mx-auto flex w-full max-w-md flex-col ">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="font-semibold text-3xl text-gray-100 dark:text-dark">
                        <p>Email Verification</p>
                    </div>
                    <div className="flex flex-row text-sm font-medium text-gray-400">
                        <p>We have sent a code to {email}</p>
                    </div>
                    {errors && (
                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium text-red-500">
                            <p>Invalid OTP code</p>
                        </div>
                    )}
                </div>
                <div>
                    <div className='flex justify-center items-center my-5'>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={handleChange}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="flex flex-col space-y-5">
                        <div>
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                            >
                                Verify Account
                            </button>
                        </div>
                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            <p>Didnt receive code?</p>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResendDisabled}
                                className={`flex flex-row items-center ${isResendDisabled ? 'text-gray-400' : 'text-blue-600'
                                    }`}
                            >
                                Resend {isResendDisabled && `(${timer}s)`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Otp;
