
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

function FeatureCard({ title, description, image, index }: FeatureCardProps) {
  return (
    <motion.div
      className='relative col-span-12 md:col-span-6 h-fit'
      initial={{ opacity: 0, x: index % 2 !== 0 ? -300 : 300 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: false }}
    >
      <div className="absolute inset-[0.7rem] rounded-lg bg-gradient-to-r from-green-600 via-cyan-600 to-violet-600 opacity-75 blur" />
      <div className='relative bg-black border border-border rounded-2xl py-5 px-3'>
        <div className='my-5'>
          <p className='text-center text-2xl font-bold'>
            {title}
          </p>
          <p className='mt-5 w-11/12 md:w-8/12 mx-auto text-center text-gray-300'>
            {description}
          </p>
        </div>
        <div className='overflow-hidden ps-8 md:ps-20'>
          <div className='border border-border w-[130%] rounded-2xl p-2'>
            <img src={image} alt={title} className="w-full h-auto rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}



export default FeatureCard;
