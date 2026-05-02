'use client';

import React, { useRef, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export interface TextBlockProps {
  textColor?: string;
  fontFamily?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  textColor = '#ededed',
  fontFamily = "'DM Sans', sans-serif",
  className,
  style = {},
  children,
}) => (
  <div
    className={cn(
      'relative z-[2] flex max-w-[750px] items-center justify-center text-center px-4',
      className
    )}
  >
    <p
      data-text-block
      className="text-[clamp(1.75rem,3vw,2.75rem)] font-normal leading-[1.6] opacity-0"
      style={{ color: textColor, fontFamily, ...style }}
    >
      {children}
    </p>
  </div>
);

interface TextBlockEffectProps {
  children: React.ReactNode;
  className?: string;
  triggerStart?: string;
}

const TextBlockEffect: React.FC<TextBlockEffectProps> = ({
  children,
  className,
  triggerStart = 'top 65%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitInstancesRef = useRef<any[]>([]);
  const lastScrollY = useRef(0);

  // =========================
  // LENIS (SMOOTH + VELOCITY TRACKING)
  // =========================
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);

      // store velocity direction
      lastScrollY.current = lenis.scroll;

      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    return () => lenis.destroy();
  }, []);

  // =========================
  // INSANE TEXT SYSTEM
  // =========================
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const texts =
        containerRef.current.querySelectorAll<HTMLParagraphElement>(
          '[data-text-block]'
        );

      const triggers: ScrollTrigger[] = [];

      texts.forEach((textEl) => {
        try {
          const split = new SplitType(textEl, {
            types: 'lines,words',
            lineClass: 'line',
            wordClass: 'word',
          });

          splitInstancesRef.current.push(split);

          const lines = split.lines as HTMLElement[];
          const words = split.words as HTMLElement[];

          // =========================
          // MASK EACH LINE (CLEAN REVEAL)
          // =========================
          lines.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'block';

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.set(textEl, { opacity: 1 });

          const section = textEl.closest('section');
          if (!section) return;

          // =========================
          // SCROLL VELOCITY CONTROL
          // =========================
          let velocity = 0;

          ScrollTrigger.create({
            trigger: section,
            start: triggerStart,
            onUpdate: (self) => {
              velocity = Math.abs(self.getVelocity()) / 1000;
            },
          });

          // =========================
          // MASTER TIMELINE
          // =========================
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: triggerStart,
              toggleActions: 'play none none reverse',
            },
          });

          // =========================
          // 1. LINE REVEAL (MAIN MOTION)
          // =========================
          tl.from(lines, {
            yPercent: 140,
            opacity: 0,
            skewY: 6,
            filter: 'blur(12px)',
            duration: 1.1,
            stagger: 0.12,
            ease: 'expo.out',
          })

            // =========================
            // 2. WORD STAGGER POP (SECOND LAYER)
            // =========================
            .from(
              words,
              {
                opacity: 0,
                yPercent: 40,
                scale: 0.95,
                filter: 'blur(6px)',
                duration: 0.6,
                stagger: {
                  each: 0.02,
                  from: 'start',
                },
                ease: 'power3.out',
              },
              '-=0.6'
            )

            // =========================
            // 3. SETTLE / SHARPEN
            // =========================
            .to(
              [lines, words],
              {
                filter: 'blur(0px)',
                skewY: 0,
                duration: 0.6,
                ease: 'power2.out',
              },
              '-=0.4'
            );

          // =========================
          // VELOCITY BOOST (SCROLL FEEL)
          // =========================
          tl.timeScale(1 + velocity * 2);

          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
        } catch (e) {
          console.warn('[INSANE TEXT] SplitType failed:', e);
        }
      });

      ScrollTrigger.refresh();

      return () => {
        splitInstancesRef.current.forEach((s) => s.revert());
        splitInstancesRef.current = [];
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [triggerStart] }
  );

  return (
    <main
      ref={containerRef}
      className={cn(
        'min-h-screen w-full overflow-x-hidden bg-[#0B0B0F] text-[#ededed]',
        className
      )}
    >
      {children}
    </main>
  );
};

export default TextBlockEffect;