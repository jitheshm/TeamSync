import React, { ReactNode } from 'react';

interface LandingProps {
    children: ReactNode;
}

function Landing({ children }: LandingProps) {
    return (
        <div className='grid sm:grid-cols-12 flex items-center justify-center gap-12 bg-[#F9FAFB] h-full'>
            <div className='col-span-6 md:col-span-5 ms-32 lg:col-span-6 hidden md:block'>
                <img src="/login.png" alt="Login Illustration" />
            </div>
            <div className='col-span-12 md:col-span-7 lg:col-span-5 flex justify-center'>
                {children}
            </div>
        </div>
    );
}

export default Landing;
