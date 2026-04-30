'use client';

import { useRef, useEffect } from 'react';
import './TextMask.css';

export default function TextMask() {
  const container = useRef<HTMLDivElement | null>(null);
  const stickyMask = useRef<HTMLDivElement | null>(null);

  const initialMaskSize = 0.8;
  const targetMaskSize = 30;
  const easing = 0.15;
  let easedScrollProgress = 0;

  useEffect(() => {
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const animate = () => {
    if (stickyMask.current) {
      const maskSizeProgress = targetMaskSize * getScrollProgress();
      const size = `${(initialMaskSize + maskSizeProgress) * 100}%`;
      stickyMask.current.style.webkitMaskSize = size;
      stickyMask.current.style.maskSize = size;
      requestAnimationFrame(animate);
    }
  };

  const getScrollProgress = () => {
    if (stickyMask.current && container.current) {
      const scrollProgress =
        stickyMask.current.offsetTop /
        (container.current.getBoundingClientRect().height - window.innerHeight);
      const delta = scrollProgress - easedScrollProgress;
      easedScrollProgress += delta * easing;
      return easedScrollProgress;
    }
    return 0;
  };

  return (
    <div className="w-full relative left-1/2 right-1/2 -mx-[50vw]">
    <main className=" w-full min-h-screen">
      <div ref={container} className="container">
        <div ref={stickyMask} className="stickyMask">
          <video autoPlay muted loop>
            <source src="/images/exhibit.mp4" type="video/mp4" className="w-full h-full object-cover" />
          </video>
        </div>
      </div>
    </main>
    </div>
  );
}