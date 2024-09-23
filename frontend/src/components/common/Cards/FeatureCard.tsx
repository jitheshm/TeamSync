import React from 'react'

function FeatureCard({ title, description, image }) {
    return (
        <div className='relative col-span-12 md:col-span-6 h-fit'> 
            <div className="absolute inset-[0.7rem] rounded-lg bg-gradient-to-r from-green-600 via-cyan-600 to-violet-600 opacity-75 blur" />
            <div className=' relative bg-black   border border-border rounded-2xl py-5 px-3'>

                <div className='my-5'>
                    <p className='text-center text-2xl'>
                        {title}
                    </p>
                    <p className='mt-5 w-11/12 md:w-8/12 mx-auto text-center'>
                        {description}
                    </p>
                </div>
                <div className='overflow-hidden ps-8 md:ps-20'>
                    <div className='border border-border w-[130%]  rounded-2xl p-2'>
                        <img src={image} alt="" />
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>

    )
}

export default FeatureCard