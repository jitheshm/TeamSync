import { resendOtp, verifyOtp } from '@/api/authService/auth';
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { z } from 'zod';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verify } from '@/features/user/userSlice';

const otpSchema = z.object({
    otp1: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
    otp2: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
    otp3: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
    otp4: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
    otp5: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
    otp6: z.string().regex(/^\d$/, "Each OTP digit must be exactly 1 digit"),
});

export interface OtpFormData {
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    otp6: string;
}

interface OtpProps {
    setOtpVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setPasswordPage: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    context: string;
}

const Otp: React.FC<Partial<OtpProps>> = ({ setOtpVisible, setPasswordPage, email, context }) => {
    const [formData, setFormData] = useState<OtpFormData>({
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: '',
    });
    const router = useRouter();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const refs = {
        otp1: useRef<HTMLInputElement>(null),
        otp2: useRef<HTMLInputElement>(null),
        otp3: useRef<HTMLInputElement>(null),
        otp4: useRef<HTMLInputElement>(null),
        otp5: useRef<HTMLInputElement>(null),
        otp6: useRef<HTMLInputElement>(null),
    } as const; // Assert that refs object has fixed keys

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (value.length === 1 && name !== 'otp6') {
            const nextField = `otp${parseInt(name.slice(3)) + 1}` as keyof OtpFormData;
            refs[nextField].current?.focus();
        }
    };

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = otpSchema.safeParse(formData);
        if (result.success) {
            try {
                const response = await verifyOtp(formData, email as string, context as string);
                if (context === "forgot-password" && setOtpVisible && setPasswordPage) {
                    Cookie.set('team-sync-token', response.token, { expires: 1 });
                    setOtpVisible(false);
                    setPasswordPage(true);
                } else {
                    Cookie.set('team-sync-token', response.token, { expires: 1 });

                    dispatch(verify({ name: response.name, tenantId: response.tenantId ?? '', role: response.role, id: response.id}));

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
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
            <div className="relative bg-white px-4 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl text-gray-900 dark:text-dark">
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
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-16 px-12">
                                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-sm gap-2">
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <div key={index} className="w-16 h-16">
                                            <input
                                                ref={refs[`otp${index}` as keyof typeof refs]}
                                                type="text"
                                                name={`otp${index}`}
                                                value={formData[`otp${index}` as keyof OtpFormData]}
                                                onChange={handleChange}
                                                maxLength={1}
                                                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700 text-gray-900"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col space-y-5">
                                    <div>
                                        <button
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
                                            className={`flex flex-row items-center ${
                                                isResendDisabled ? 'text-gray-400' : 'text-blue-600'
                                            }`}
                                        >
                                            Resend {isResendDisabled && `(${timer}s)`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otp;
