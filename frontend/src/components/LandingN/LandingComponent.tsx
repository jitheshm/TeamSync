"use client";
import React, { useState } from 'react'
import Hero from './Hero'
import UIDemo from './UIDemo'
import { ScrollArea } from '../ui/scroll-area'
import Features from './Features'
import Price from './Price'
import Testimonials from './Testimonials'
import Footer from './Footer'
import { FlotingNavbar } from './FlotingNavbar'

interface LandingComponentProps {
    setScrollY: (scrollY: number) => void; 
}

const LandingComponent: React.FC<LandingComponentProps> = ({ setScrollY }) => {
    const [rotation, setRotation] = useState(90);
    const [isVisible, setIsVisible] = useState(false);


    const fn = (e:any) => {
        setScrollY(e.target.scrollTop)
        if (isVisible) {
            const scrollTop = e.target.scrollTop;
            const maxScrollTop = e.target.scrollHeight - e.target.clientHeight;

            // Calculate the percentage of the scroll position
            const scrollPercentage = Math.min(scrollTop / maxScrollTop, 1);
            console.log(scrollTop, maxScrollTop, scrollPercentage)
            // Reduce rotation from 90 to 0 based on scroll progress
            const val = 90 - (scrollPercentage * 90) * 4
            setRotation((prev) => {
                if (val > 0) {

                    return val
                } else {
                    return prev
                }
            });
        }
    };

    return (
        <>
            <ScrollArea onScrollCapture={fn} className="h-[calc(100vh_-_4rem)]">

                <div className='hidden md:block fixed left-1/2 right-1/2 top-0 z-10'>
                    <FlotingNavbar />
                </div>
                <Hero />
                <UIDemo rotation={rotation} setIsVisible={setIsVisible} />
                <Features />
                <Price />
                <Testimonials />
                <Footer />

            </ScrollArea>
        </>

    )
}

export default LandingComponent