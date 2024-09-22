import React from 'react'
import { Navbar } from './Navbar'
import Hero from './Hero'
import UIDemo from './UIDemo'
import { ScrollArea } from '../ui/scroll-area'
import Features from './Features'
import Price from './Price'
import Testimonials from './Testimonials'

function LandingComponent() {
    return (
        <>
            <ScrollArea className='h-screen '>
                <div className='hidden md:block fixed left-1/2 right-1/2 z-10'>
                    <Navbar />
                </div>
                <Hero />
                <UIDemo />
                <Features />
                <Price />
                <Testimonials />
            </ScrollArea>
        </>

    )
}

export default LandingComponent