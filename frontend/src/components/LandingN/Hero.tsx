import { Button } from '@nextui-org/react'
import React from 'react'
import FlowChartSvg from '../common/Svg/FlowChartSvg'

function Hero() {
    return (
        <div className='mt-36 lg:mt-10 grid grid-cols-12'>
            <div className='col-span-12 lg:col-span-6 flex w-full h-full items-center'>
                <div className=' mx-auto text-center w-full '>
                    <h1 className="text-4xl font-medium  tracking-tight sm:text-5xl mb-3 "  >Empower Your Team </h1>
                    <h1 className="text-4xl  font-medium tracking-tight  sm:text-5xl ">Any Time Any Where</h1>
                    <div className='text-center w-11/12 mx-auto px-5 sm:px-0 '>
                        <p className="mt-6 text-lg leading-8 text-gray-300">Empower your team with our intuitive remote collaboration platform. Work together, communicate effectively, and achieve more.</p>

                    </div>
                    <div className='mt-5'>
                        <Button color="primary" variant="shadow">
                            Get Started
                        </Button>
                    </div>
                </div>

            </div>
            <div className=' col-span-12 lg:col-span-6 flex items-center justify-center'>
                <div className='border border-border rounded-2xl h-4/6 w-11/12 relative ' >
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                       linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px),
                       linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
                     `,
                        backgroundSize: '16px 16px'
                    }} />
                    <FlowChartSvg />

                </div>

            </div>


        </div>
    )
}

export default Hero