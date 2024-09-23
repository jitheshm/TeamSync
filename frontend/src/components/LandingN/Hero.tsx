import { Button } from '@nextui-org/react'
import React from 'react'

function Hero() {
    return (
        <div className='h-[40rem] grid grid-cols-12'>
            <div className='col-span-6 flex w-full h-full items-center'>
                <div className=' mx-auto text-center w-full '>
                    <h1 className="text-4xl font-medium  tracking-tight sm:text-5xl mb-3 "  >Empower Your Team </h1>
                    <h1 className="text-4xl  font-medium tracking-tight  sm:text-6xl ">Any Time Any Where</h1>
                    <div className='text-center w-full mx-auto px-5 sm:px-0 '>
                        <p className="mt-6 text-lg leading-8 text-gray-300">Empower your team with our intuitive remote collaboration platform. Work together, communicate effectively, and achieve more.</p>

                    </div>
                    <div className='mt-5'>
                        <Button color="primary" variant="shadow">
                            Get Started
                        </Button>
                    </div>
                </div>

            </div>
            <div className='col-span-6 flex items-center justify-center'>
                <div className='border border-border rounded-2xl h-4/6 w-11/12 relative'>
                    <div className="absolute inset-0" style={{
                       backgroundImage: `
                       linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px),
                       linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
                     `,
                        backgroundSize: '16px 16px'
                    }} />
                    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" >

                        {/* <!-- Vertical line from the center --> */}
                        <path d="M 50 0 L 50 15" stroke="white" stroke-width="0.2" fill="none" />

                        {/* <!-- Small rhombus at the end of the line --> */}
                        <polygon points="50,15 55,20 50,25 45,20" stroke="white" stroke-width="0.2" fill="green" />

                        {/* <!-- Horizontal line with a small curve to the right and vertical down --> */}
                        <path d="M 55 20 L 70 20 Q 72 20,72 22 L 72 37" stroke="white" stroke-width="0.2" fill="none" />

                        {/* <!-- Second rhombus at the end of this line --> */}
                        <polygon points="72,37 77,42 72,47 67,42" stroke="white" stroke-width="0.2" fill="green" />

                        {/* <!-- Horizontal line with a small curve and vertical down --> */}
                        <path d="M 77 42 L 97 42 Q 99 42,99 44 L 99 59" stroke="white" stroke-width="0.2" fill="none" />

                        {/* <!-- Rectangle at the end of this line --> */}
                        <rect x="89" y="59" width="20" height="10" stroke="white" stroke-width="0.2" fill="lightslategrey" />

                        {/* <!-- Vertical line with a small curve back to the center --> */}
                        <path d="M 99 69 L 99 80 Q 99 81 97 81 L 50 81" stroke="white" stroke-width="0.2" fill="none" />

                        {/* <!-- Vertical line from the second rhombus down to the rectangle --> */}
                        <path d="M 72 47 L 72 81" stroke="white" stroke-width="0.2" fill="none" />

                        {/* <!-- Extra step: Horizontal line and rhombus on the left --> */}
                        <path d="M 50 81 L 30 81 Q 28 81, 28 79 L 28 64" stroke="white" stroke-width="0.2" fill="none" />
                        <polygon points="28,64 33,59 28,54 23,59" stroke="white" stroke-width="0.2" fill="green" />

                        {/* <!-- Horizontal line continuing left from the rhombus --> */}
                        <path d="M 23 59 L 10 59" stroke="white" stroke-width="0.2" fill="none" />
                        <path d="M 45 20 L 30 20" stroke="white" stroke-width="0.2" fill="none" />
                        <rect x="10" y="16" width="20" height="8" stroke="white" stroke-width="0.2" fill="lightslategrey" />
                        <path d="M 10 20 L 0 20" stroke="white" stroke-width="0.2" fill="none" />


                    </svg>

                </div>

            </div>


        </div>
    )
}

export default Hero