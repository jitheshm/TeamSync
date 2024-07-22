import React from 'react'

function CTA() {
    return (
        <div className='w-screen  flex items-center bg-gradient-to-b from-[#ffffff] from-60%  to-[#f1e1ff]'>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 flex items-center h-fit">
               
                <div className="text-center h-fit">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">SignUp Now</h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">Celebrate the joy of accomplishment with an app designed to track team progress and motivate their efforts.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href="#" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
                       
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default CTA