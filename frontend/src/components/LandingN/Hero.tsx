import { Button } from '@nextui-org/react'
import React from 'react'

function Hero() {
    return (
        <div className='h-[40rem] flex items-center justify-center'>
            <div className=' mx-auto text-center '>
                <h1 className="text-4xl font-medium  tracking-tight sm:text-5xl mb-3 "  >Empower Your Team </h1>
                <h1 className="text-4xl  font-medium tracking-tight  sm:text-6xl ">Any Time Any Where</h1>
                <div className='text-center md:w-[35rem] mx-auto px-5 sm:px-0'>
                    <p className="mt-6 text-lg leading-8 text-gray-300">Empower your team with our intuitive remote collaboration platform. Work together, communicate effectively, and achieve more.</p>

                </div>
                <div className='mt-5'>
                    <Button color="primary" variant="shadow">
                        Get Started
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default Hero