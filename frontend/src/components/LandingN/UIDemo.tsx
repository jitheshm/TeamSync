import React, { useRef, useEffect, useState } from 'react'

function UIDemo({ rotation,setIsVisible }) {
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
      className={` transform transition-transform duration-100 will-change-transform`}
      style={{
        transform: `rotateX(${rotation}deg)`,
        // perspective: '100px',
        // ... other styles ...
    }}
      >
      <div className='border-4 border-border  w-10/12 m-auto my-10 h-fit rounded-3xl p-1 md:p-3 overflow-hidden '>
        <img src="/landing/ui.png" alt="" className='w-full hidden md:block' />
        <img src="/landing/ui-mobile.png" alt="" className='w-full  md:hidden' />
      </div>
    </div>
  )
}

export default UIDemo