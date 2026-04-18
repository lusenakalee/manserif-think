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
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (stickyMask.current) {
      const maskSizeProgress = targetMaskSize * getScrollProgress();
      stickyMask.current.style.webkitMaskSize =
        `${(initialMaskSize + maskSizeProgress) * 100}%`;
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
    <main className="main bg-white ">
      <div ref={container} className="container ">
        <div ref={stickyMask} className="stickyMask">
          <video autoPlay muted loop>
            <source src="/images/exhibit.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}