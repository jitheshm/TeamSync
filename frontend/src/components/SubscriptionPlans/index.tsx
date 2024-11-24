"use client"
import React, { useEffect, useState } from 'react'
// import PriceCard from './PriceCard'
import { fetchAvailablePlans, fetchPlans } from '@/api/subscriptionService/subscription'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import PriceCard from '../common/Cards/PriceCard'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'
import { IPlan } from '@/interfaces/subscription'

function Index() {
    const [plans, setPlans] = useState([])
    const router = useRouter()
    const dispatch = useDispatch()
    useEffect(() => {
        fetchAvailablePlans().then((result) => {
            setPlans(result.data.data)
        }).catch((error: any) => {
            if (error.response.status === 401) {
                dispatch(logout())

                router.push('/login')
            }
        })
    }, [])

    return (
        <div className=" text-gray-100  ">
            <ScrollArea className="h-[calc(100vh_-_4rem)]">
                <div className='my-10'>
                    <div>
                        <h2 className="text-xl font-bold tracki text-center mt-12 sm:text-5xl ">Pricing</h2>
                        <p className="max-w-xl mx-auto mt-4 text-xl text-center ">Get started on our popular plan and upgrade when you are
                            ready.</p>
                    </div>
                    <div className="my-5 flex flex-wrap justify-around md:w-11/12 gap-4 lg:gap-0 mx-auto ">

                        {
                            plans.map((ele:IPlan, index) => {
                                return (
                                    <PriceCard plan={ele} key={index} >
                                        <Link className="bg-emerald-500 text-white  hover:bg-emerald-600  block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium mt-32" href={`/tenant-registration/${ele.stripe_plan_id}`}>Select</Link>
                                    </PriceCard>
                                    // <PriceCard plan={ele} key={index} />
                                )
                            })
                        }



                    </div>
                </div>
            </ScrollArea>
        </div>


    )
}

export default Index