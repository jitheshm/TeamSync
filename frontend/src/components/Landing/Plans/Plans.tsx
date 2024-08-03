"use client"
import { fetchPlans } from '@/api/subscriptionService/subscription'
import PriceCard from '@/components/SubscriptionPlans/PriceCard'
import { IPlan } from '@/interfaces/subscription'
import Link from 'next/link'
import { useEffect, useState } from 'react'



 function Plans() {
    const [plans, setPlans] = useState<IPlan[]>([])

    useEffect(() => {
        fetchPlans().then((response) => {
            setPlans(response.data)
        })
    },[])

    return (
        <div className='w-screen min-h-screen bg-white text-black'>

            <div className=' w-11/12 md:w-7/12 lg:w-7/12 xl:w-4/12 mx-auto pt-20 '>
                <h1 className="text-3xl lg:text-5xl  font-bold tracking-tight  text-center ">Choose Your Plan</h1>
            </div>
            <div className='grid grid-cols-12 md:w-11/12 xl:w-9/12 mx-auto mt-20 '  >

                {
                    plans.map((plan, index) => {
                        return (

                            <div id='plans' className='col-span-12 xl:col-span-4' key={index}>
                                <div className=' h-fit  '>


                                    <div className="relative flex flex-col  mt-6 text-gray-700 bg-white drop-shadow-lg bg-clip-border rounded-xl  mx-auto w-72  lg:w-96 p-10">
                                        <p className='font-semibold'>{plan.name}</p>
                                        <p className="mt-10 flex items-baseline text-black">
                                            <span className="text-5xl font-extrabold tracking-tight">$12</span><span className="ml-1 text-xl font-semibold">/{plan.bill_cycle}</span>
                                        </p>

                                        <Link href={'/signup'} className="text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-10 text-center">Sign up now</Link>

                                        <ul role="list" className="mt-6 space-y-6">
                                            <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-black" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg><span className="ml-3 ">Upto {plan.features.branches} Branches</span></li>
                                            <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-black" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg><span className="ml-3 ">Unlimited projects and tasks</span></li>
                                            <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-black" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg><span className="ml-3 ">Unlimited Chatting</span></li>
                                            <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-black" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg><span className="ml-3 ">Video Call facility</span></li>
                                            <li className="flex"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-6 h-6 text-black" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg><span className="ml-3 ">{plan.features.support} Support</span></li>

                                        </ul>

                                    </div>

                                </div>
                            </div>

                        )
                    })
                }
            </div>

        </div>
    )
}

export default Plans