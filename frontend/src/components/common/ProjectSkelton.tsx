import React from 'react'
import { CardSkelton } from './Cards/CardSkelton'

function ProjectSkelton() {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-1'>
            <CardSkelton />
            <CardSkelton />
            <CardSkelton />
            <CardSkelton />
            <CardSkelton />
            <CardSkelton />
        </div>
    )
}

export default ProjectSkelton