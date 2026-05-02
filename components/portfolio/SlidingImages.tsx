'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

interface SlideItem {
  color: string;
  src: string;
}

const slider1: SlideItem[] = [
  { color: '#e3e5e7', src: '/images/charcoal6.webp' },
  { color: '#d6d7dc', src: '/images/forgive1.webp' },
  { color: '#e3e3e3', src: '/images/general1.webp' },
  { color: '#21242b', src: '/images/poetic2.webp' },
];

const slider2: SlideItem[] = [
  { color: '#e3e5e7', src: '/images/charcoal6.webp' },
  { color: '#d6d7dc', src: '/images/forgive1.webp' },
  { color: '#e3e3e3', src: '/images/general1.webp' },
  { color: '#21242b', src: '/images/poetic2.webp' },
];

export default function SlidingImages() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div
      ref={container}
      className="relative z-10 mt-[200px] flex flex-col gap-[3vw] bg-white"
    >
      {/* Slider 1 — moves right on scroll */}
      <motion.div
        style={{ x: x1 }}
        className="relative left-[-10vw] flex w-[120vw] gap-[3vw]"
      >
        {slider1.map((project, index) => (
          <div
            key={index}
            className="flex h-[20vw] w-1/4 shrink-0 items-center justify-center"
            style={{ backgroundColor: project.color }}
          >
            <div className="relative h-4/5 w-4/5">
              <Image
                fill
                alt="image"
                src={`${project.src}`}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Slider 2 — moves left on scroll */}
      <motion.div
        style={{ x: x2 }}
        className="relative left-[-10vw] flex w-[120vw] gap-[3vw]"
      >
        {slider2.map((project, index) => (
          <div
            key={index}
            className="flex h-[20vw] w-1/4 shrink-0 items-center justify-center"
            style={{ backgroundColor: project.color }}
          >
            <div className="relative h-4/5 w-4/5">
              <Image
                fill
                alt="image"
                src={`${project.src}`}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Circle container — shrinks as you scroll */}
      <motion.div
        style={{ height }}
        className="relative mt-[100px] bg-red-600 hidden md:block"
      >
        <div
          className="absolute left-[-10%] z-10 h-[1550%] w-[120%] rounded-b-[50%] bg-white"
          style={{ boxShadow: '0px 60px 50px rgba(0,0,0,0.748)' }}
        />
      </motion.div>
    </div>
  );
}