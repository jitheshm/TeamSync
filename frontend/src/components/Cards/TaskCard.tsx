import React from 'react';

interface TaskCardProps {
    count: number;
    title: string;
    grd1: string; 
    grd2: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ count, title, grd1, grd2 }) => {
    return (
        <div className={`bg-gradient-to-t from-[${grd1}] to-[${grd2}] h-48 w-48 rounded-2xl drop-shadow-xl`}>
            <p className='font-bold text-6xl text-center pt-10'>
                {count}
            </p>
            <p className='font-bold text-center mt-5'>
                {title}
            </p>
        </div>
    );II
}

export default TaskCard;
