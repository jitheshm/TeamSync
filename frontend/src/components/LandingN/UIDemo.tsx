import React, { useRef, useEffect, useState } from 'react'

function UIDemo({ rotation, setIsVisible }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  return (
    <div ref={cardRef}
      className={`relative transform transition-transform duration-100 will-change-transform`}
      style={{
        transform: `rotateX(${rotation}deg)`,
        // perspective: '100px',
        // ... other styles ...
      }}
    >
      <div className='h-[120px] w-1/6 md:w-1/2 absolute bg-[#8624ff] rounded-full top-[90px] left-[180px] blur-[40px] md:blur-[50px]'></div>
      <div className='h-[160px] w-1/6 md:w-1/2 absolute bg-[#22d2ed] rounded-full top-[90px] right-[180px] blur-[40px] md:blur-[50px]'></div>
      <div className='z-10 relative'>
        <div className='border-4   border-border w-8/12 md:w-10/12 m-auto my-10 h-fit rounded-3xl  overflow-hidden z-10 '>
          <img src="/landing/ui.png" alt="" className='w-full hidden md:block' />
          <img src="/landing/ui-mobile.png" alt="" className='w-full  md:hidden' />
        </div>
      </div>
      <div className='h-[120px] w-1/6 md:w-1/2 absolute bg-[#8624ff] rounded-full bottom-[90px] left-[170px] blur-[40px] md:blur-[50px]'></div>
      <div className='h-[160px] w-1/6 md:w-1/2 absolute bg-[#22d2ed] rounded-full bottom-[90px] right-[170px] blur-[40px] md:blur-[50px]'></div>
    </div>
  )
}

export default UIDemo