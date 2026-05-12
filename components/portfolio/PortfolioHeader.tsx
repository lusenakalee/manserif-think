'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  const firstText = useRef<HTMLParagraphElement | null>(null);
  const secondText = useRef<HTMLParagraphElement | null>(null);
  const slider = useRef<HTMLDivElement | null>(null);

  const xPercent = useRef(0);
  const direction = useRef(-1);

  useEffect(() => {
    if (!firstText.current || !secondText.current || !slider.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Place second text right after first
    gsap.set(secondText.current, {
      left: secondText.current.getBoundingClientRect().width,
    });

    // ScrollTrigger controls direction + extra movement
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.5,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => {
          direction.current = e.direction * -1;
        },
      },
    });

    // Horizontal push on scroll
    tl.to(slider.current, {
      x: '-500px',
      ease: 'none',
    });

    // GSAP ticker instead of RAF
    const update = () => {
      if (!firstText.current || !secondText.current) return;

      if (xPercent.current < -100) {
        xPercent.current = 0;
      } else if (xPercent.current > 0) {
        xPercent.current = -100;
      }

      gsap.set([firstText.current, secondText.current], {
        xPercent: xPercent.current,
      });

      xPercent.current += 0.1 * direction.current;
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <main className="relative flex h-screen  overflow-hidden">
      <Image
        src="/images/background.webp"
        fill
        alt="background"
        priority
        className="object-cover object-top"
      />

      <div className="absolute top-[calc(100vh-200px)] md:top-[calc(100vh-300px)] lg:top-[calc(100vh-350px)]">
        <div ref={slider} className="relative whitespace-nowrap">
          
          {/* Responsive text */}
          <p
            ref={firstText}
            className="
              relative m-0 text-white font-medium pr-[50px]
              text-[60px]
              sm:text-[90px]
              md:text-[140px]
              lg:text-[200px]
              xl:text-[230px]
            "
          >
           Warren Kamau -
          </p>

          <p
            ref={secondText}
            className="
              absolute left-full top-0 m-0 text-white font-medium pr-[50px]
              text-[60px]
              sm:text-[90px]
              md:text-[140px]
              lg:text-[200px]
              xl:text-[230px]
            "
          >
           Manserif.Think -
          </p>
        </div>
      </div>
    </main>
  );
}