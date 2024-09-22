import React from 'react'
import { cn } from "@/lib/utils";
import { CardStack } from '../ui/card-stack';

function Testimonials() {
    const CARDS = [
        {
            id: 0,
            name: " Sarah K",
            designation: "Senior Software Engineer",
            content: (
                <p>
                    This platform has transformed how we manage projects remotely. The ability to assign roles like Manager, Developer, and Tester, along with the built-in chat and video conferencing features, makes collaboration smooth and efficient. Highly recommend for any startup looking to improve team communication and productivity!
                </p>
            ),
        },
        {
            id: 1,
            name: "David P.",
            designation: "Senior Tech Lead",
            content: (
                <p>
                    We were juggling multiple tools for project management, communication, and meetings before switching to this platform. Now, everything we need is in one place. The video conferencing feature is fantastic, and the UI is clean and user-friendly. The perfect tool for small companies!
                </p>
            ),
        },
        {
            id: 2,
            name: "Emily R",
            designation: "CTO Mayhem",
            content: (
                <p>
                    The role-based permissions are a lifesaver for managing our projects. It’s so easy to assign tasks to developers and track progress. The only issue we faced was minor lag during video calls, but overall, the platform has been a game-changer for us!
                </p>
            ),
        },
        {
            id: 3,
            name: "Jason M.",
            designation: "CEO ABC",
            content: (
                <p>
                    As our team expanded, managing projects and keeping everyone on the same page became a challenge. This platform made everything so much easier, from setting up projects to tracking developer progress. The real-time chat and meetings feature saves us so much time!
                </p>
            ),
        },
    ];

    return (
        <div className='my-10'>
            <div className='w-fit border border-border mx-auto rounded-3xl py-1 px-5 mt-32 mb-10'>
                <p>Testimonials</p>
            </div>
            <div className='my-28'>
                <div className="h-fit flex items-center justify-center w-full">
                    <CardStack items={CARDS} />
                </div>
            </div>
        </div>
    )
}

export default Testimonials