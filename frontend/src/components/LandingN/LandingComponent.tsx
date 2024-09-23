import React from 'react'
import Hero from './Hero'
import UIDemo from './UIDemo'
import { ScrollArea } from '../ui/scroll-area'
import Features from './Features'
import Price from './Price'
import Testimonials from './Testimonials'
import Footer from './Footer'
import { FlotingNavbar } from './FlotingNavbar'

function LandingComponent() {
    return (
        <>
            <ScrollArea className="h-[calc(100vh_-_4rem)]">
                <div className='hidden md:block fixed left-1/2 right-1/2 z-10'>
                    <FlotingNavbar />
                </div>
                <Hero />
                <UIDemo />
                <Features />
                <Price />
                <Testimonials />
                <Footer/>
            </ScrollArea>
        </>

    )
}

export default LandingComponent