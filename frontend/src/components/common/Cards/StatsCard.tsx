import React from 'react'

interface StatsCardProps {
    count: number;
    title: string;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ count, title, className }) => {
    return (
        <div className={className}>
            <p className='font-bold text-4xl text-center pt-5'>
                {count}
            </p>
            <p className='font-bold text-center mt-5'>
                {title}
            </p>
        </div>
    )
}

export default StatsCard