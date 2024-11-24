import React, { ReactNode } from 'react';

interface LoginProps {
    children: ReactNode;
}

function index({ children }: LoginProps) {
    return (
        <div className='grid sm:grid-cols-12 flex items-center justify-center gap-12 overflow-hidden'>
            <div className='col-span-6 md:col-span-5 ms-32 lg:col-span-6 hidden md:block'>
                <img src="/login.png" alt="Login Illustration" />
            </div>
            <div className='col-span-11 md:col-span-7 lg:col-span-5 flex justify-center relative'>
            <div className="w-44 hidden md:block absolute top-0 left-0  h-44 bg-gradient-to-b from-[#520061b7] to-[#0D0A30] rounded-full p-6 shadow-lg"/>
            <div className="w-44 hidden md:block absolute bottom-0 right-0  h-44 bg-gradient-to-b from-[#300061] to-[#0D0A30] rounded-full p-6 shadow-lg"/>
                {children}
            </div>
        </div>
    );
}

export default index;
