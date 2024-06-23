import React from 'react'
import PriceCard from './PriceCard'

function index() {
    return (
        <div className="bg-white h-screen text-gray-950 pt-16">
            <div>
                <h2 className="text-3xl font-bold tracki text-center mt-12 sm:text-5xl ">Pricing</h2>
                <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">Get started on our popular plan and upgrade when you are
                    ready.</p>
            </div>
            <div className="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8 mx-auto">

                <PriceCard/>
                <PriceCard/>
                <PriceCard/>
                

            </div>
        </div>


    )
}

export default index