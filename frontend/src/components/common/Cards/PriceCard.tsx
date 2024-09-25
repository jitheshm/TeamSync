import { IPlan } from '@/interfaces/subscription'
import Link from 'next/link'
import React from 'react'

function PriceCard({ plan }: { plan: IPlan }) {
    return (
        <div className='lg:w-3/12 w-11/12   border border-border rounded-2xl p-5 relative overflow-hidden'>
                        <svg
                className="absolute inset-0 -z-10 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                 preserveAspectRatio="none"
            >
                <rect width={100} height={100} x={0} y={0} fill="black" />
                <polygon points="0,100 100,50 100,100" fill="white" />
            </svg>
            <div>
                <p className='text-xl'>
                    {plan.name}
                </p>
            </div>
            <div className='mt-3'>
                <p className='text-xl '>
                    <span className=' text-3xl font-semibold'>
                        {plan.price}
                    </span>
                    /{plan.bill_cycle}
                </p>
            </div>
            <hr className='my-5' />

            <div >
                <ul role="list" className="mt-6 space-y-6">
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Upto {plan.features.branches} Branches</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Unlimited projects</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Unlimited Chatting</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">Video Call facility</span></li>
                    <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-primary" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                    </svg><span className="ml-3 ">{plan.features.support} Support</span></li>

                </ul>
            </div>
            <div className='text-center my-10'>
                <Link href={'/signup'} className="text-white bg-primary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-10 text-center">Sign up now</Link>

            </div>
        </div>
    )
}

export default PriceCard