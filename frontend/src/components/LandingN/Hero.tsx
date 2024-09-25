import { Button } from '@nextui-org/react'
import React from 'react'
import FlowChartSvg from '../common/Svg/FlowChartSvg'
import { motion } from 'framer-motion';

function Hero() {
    return (
        <div className=' lg:mt-10 grid grid-cols-12'>
            <motion.div
                className='order-2 md:order-none mx-auto text-center col-span-12 lg:col-span-6 flex w-full h-full items-center'
                initial={{ opacity: 0, y: 30 }} // Increased y value for more noticeable movement
                animate={{ opacity: 1, y: 0 }} // Move to original position
                exit={{ opacity: 0, y: 30 }} // Maintain the increased y value for exit
                transition={{ duration: 0.6, ease: "easeOut" }} // Slightly longer duration with ease-out effect
            >
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

            </motion.div>
            <div className=' order-1 md:order-none col-span-12 lg:col-span-6 flex items-center justify-center'>
                <div className='bg-gradient-to-br from-black via-black  to-black border border-border rounded-2xl h-4/6 w-11/12 relative shadow-[0_1px_10px_rgba(255,255,255,0.1),0_3px_15px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-300 overflow-hidden' >
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