"use client"
import React, { useEffect, useState } from 'react'
import PriceCard from './PriceCard'
import { fetchAvailablePlans, fetchPlans } from '@/api/subscriptionService/subscription'
import { logout } from '@/features/user/userSlice'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

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
        <div className="bg-white h-screen text-gray-950 pt-16">
            <div>
                <h2 className="text-3xl font-bold tracki text-center mt-12 sm:text-5xl ">Pricing</h2>
                <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">Get started on our popular plan and upgrade when you are
                    ready.</p>
            </div>
            <div className="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8 mx-auto">

                {
                    plans.map((ele, index) => {
                        return (
                            <PriceCard plan={ele} key={index} />
                        )
                    })
                }



            </div>
        </div>


    )
}

export default Index