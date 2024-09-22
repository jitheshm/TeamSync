import React from 'react'
import FeatureCardBase from '../common/Cards/FeatureCardBase'
import FeatureCard from '../common/Cards/FeatureCard'

function Features() {
    return (
        <div className='my-10'>
            <div className='w-fit border border-border mx-auto rounded-3xl py-1 px-5 mt-32 mb-5'>
                <p>Features</p>
            </div>

            <FeatureCardBase>
                <FeatureCard
                    title='Simple Dashboard'
                    description='Empower your choices with insights derived from our real-time data streams.'
                    image="/landing/dashboard.png"
                />
                <FeatureCard
                    title='Project Management'
                    description='Empower your choices with insights derived from our real-time data streams.'
                    image="/landing/project.png"
                />
                <FeatureCard
                    title='Chatting'
                    description='Empower your choices with insights derived from our real-time data streams.'
                    image="/landing/chat.png"
                />
                <FeatureCard
                    title='Project Management'
                    description='Empower your choices with insights derived from our real-time data streams.'
                    image="/landing/project.png"
                />

                

            </FeatureCardBase>
        </div>
    )
}

export default Features