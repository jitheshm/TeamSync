import { IProjects } from '@/interfaces/Project';
import React from 'react';

function Cards({ data }: { data: IProjects }) {
    return (
        <div className='inline-block min-w-[300px] flex flex-col h-64 rounded-lg bg-gradient-to-tl from-[#0A325A] to-[#1D5BA9]'>
            <p className='text-center pt-10 font-bold'>
                {data.name}
            </p>
            <div className='flex justify-center items-center flex-1'>
                <div className={`rounded-full w-32 h-32 ${data.stage === 'pending' ? 'bg-red-500' : data.stage === 'development' ? 'bg-yellow-600' : ' bg-green-600'} flex justify-center items-center drop-shadow-2xl`}>
                    <span>{data.stage}</span>
                </div>
            </div>
        </div >
    );
}

export default Cards;
