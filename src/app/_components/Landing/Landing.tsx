'use client';
import { ArrowBigDownDash } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <main className="flex w-full flex-col p-4">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl lg:text-7xl">Software</h1>
          <h1 className="text-4xl md:text-5xl lg:text-7xl">Engineer</h1>
        </div>
        <p className="mt-5 flex justify-center text-sm md:mt-8 md:text-base lg:mt-10">
          {'</'}Full-Stack Developer, CS Grad 2025{'>'}
        </p>
        <h1 className="mt-16 flex justify-end text-4xl md:mt-24 md:text-5xl lg:mt-32 lg:text-7xl">
          WIN CHENG
        </h1>
        <motion.div
          className="mt-8 flex w-full flex-col items-center justify-center md:mt-12 lg:mt-16"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'easeInOut',
            },
          }}
        >
          <ArrowBigDownDash size={50} className="m-auto" />
          <p className="text-sm md:text-base">SCROLL</p>
        </motion.div>
      </div>
    </main>
  );
}
