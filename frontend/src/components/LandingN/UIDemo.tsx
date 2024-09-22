import React from 'react'

function UIDemo() {
  return (
    <div>
        <div className='border-2 border-border  w-7/12 m-auto my-10 h-fit rounded-3xl p-1 md:p-3 overflow-hidden '>
            <img src="/landing/ui.png" alt="" className='w-full hidden md:block' />
            <img src="/landing/ui-mobile.png" alt="" className='w-full  md:hidden' />
        </div>
    </div>
  )
}

export default UIDemo