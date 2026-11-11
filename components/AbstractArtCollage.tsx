
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CollageItem } from '@/types/category';
import { Maximize2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AbstractArtCollageProps {
  items: CollageItem[];
  onSelectItem: (item: CollageItem) => void;
}

// Deliberate editorial composition rhythm
const compositions = [
  { width: 'w-[88%] sm:w-[82%]', align: 'mr-auto' },
  { width: 'w-[76%] sm:w-[72%]', align: 'ml-auto' },
  { width: 'w-[84%] sm:w-[78%]', align: 'mx-auto' },
  { width: 'w-[72%] sm:w-[68%]', align: 'mr-auto' },
];

export default function AbstractArtCollage({
  items,
  onSelectItem,
}: AbstractArtCollageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const img = card.querySelector('.artwork-img-container');

        // Reveal on scroll entrance
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Subtle parallax drift
        const parallaxSpeed =
          index % 3 === 0 ? -30 : index % 2 === 0 ? 35 : -15;

        if (img) {
          gsap.to(img, {
            y: parallaxSpeed,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <section
      id="artworks-collage"
      ref={containerRef}
      className="py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-20 sm:gap-y-28 lg:gap-y-32 items-start">
        {items.map((item, idx) => {
          let aspectClass = 'aspect-[4/3]';

          if (item.aspect === 'panoramic')
            aspectClass = 'aspect-[16/9] sm:aspect-[16/8]';
          else if (item.aspect === 'portrait')
            aspectClass = 'aspect-[3/4] sm:aspect-[4/5]';
          else if (item.aspect === 'square')
            aspectClass = 'aspect-square';
          else if (item.aspect === 'landscape')
            aspectClass = 'aspect-[16/10]';

          // Apply a consistent four-part composition pattern
          const composition = compositions[idx % compositions.length];

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={`${item.colSpan} ${item.offsetClass} group relative cursor-pointer`}
              onClick={() => onSelectItem(item)}
            >
              {/* Artwork Frame */}
              <div
                className={`relative ${composition.width} ${composition.align} overflow-hidden bg-stone-200 border border-stone-200/80 rounded-xs transition-shadow duration-500 group-hover:shadow-xl`}
              >
                <div
                  className={`artwork-img-container relative w-full ${aspectClass} transition-transform duration-700 ease-out group-hover:scale-[1.025]`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 600px"
                    className="object-cover transition-all duration-700 filter group-hover:contrast-105"
                    referrerPolicy="no-referrer"
                    priority={idx < 3}
                    placeholder={item.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.lqip ?? undefined}
                  />

                  {/* Hover Scrim */}
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-500" />

                  {/* Fullscreen Icon */}
                  <div className="absolute top-4 right-4 p-2 bg-stone-900/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xs transform translate-y-1 group-hover:translate-y-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Type Badge */}
                  {item._type !== 'art' && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-stone-900/70 backdrop-blur-xs text-white text-[10px] uppercase tracking-widest rounded-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item._type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
