import React from 'react'
import fontColorContrast from 'font-color-contrast'
import randomColor from 'randomcolor'
import MoreButton from '../Buttons/MoreButton'

function StatusCard() {

    const bgColor = randomColor()
    const textFont = fontColorContrast(bgColor)

    return (
        <div className='flex justify-between p-4'>
            <div className='flex'>
                <div className='w-6 h-6 me-5 p-2 rounded-full flex justify-center items-center' style={{ backgroundColor: bgColor, color: textFont }}>
                    G
                </div>
                <div className='w-full'>
                    Project Name
                </div>
            </div>
            <div>
                <MoreButton />
            </div>
        </div>
    )
}

export default StatusCard