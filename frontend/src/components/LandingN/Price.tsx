"use client"
import { fetchAvailablePlans } from '@/api/subscriptionService/subscription'
import { IPlan } from '@/interfaces/subscription'
import React, { useEffect, useState } from 'react'
import PriceCard from '../common/Cards/PriceCard'

function Price() {
    const [plans, setPlans] = useState<IPlan[]>([])

    useEffect(() => {
        fetchAvailablePlans().then((response) => {
            setPlans(response.data.data)
        })
    }, [])
    return (
        <div className='my-10'>
            <div className='w-fit border border-border mx-auto rounded-3xl py-1 px-5 mt-32 mb-10'>
                <p>Pricing</p>
            </div>
            <div className='my-5 flex flex-wrap justify-around md:w-11/12 gap-4 lg:gap-0 mx-auto'>
                {
                    plans.map((plan) => {
                        return (
                            <PriceCard key={plan.name} plan={plan} />
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Price