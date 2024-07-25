import React, { ReactNode } from 'react';

function Slider({ children }: { children: ReactNode }) {
    return (
        <div className='w-10/12 mx-auto overflow-x-scroll scrollbar-hidden whitespace-nowrap mt-10'>
            <div className='flex gap-4'>
                {children}
            </div>
        </div>
    );
}

export default Slider;
