'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Artwork } from '@/types/exhibition';
import { Maximize2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AbstractArtCollageProps {
  artworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
}

export default function AbstractArtCollage({
  artworks,
  onSelectArtwork
}: AbstractArtCollageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate each artwork card on scroll entrance
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const img = card.querySelector('.artwork-img-container');

        // Reveal animation
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

        // Subtle Parallax drift for varied depth feeling
        const parallaxSpeed = (index % 3 === 0 ? -30 : index % 2 === 0 ? 35 : -15);
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
  }, [artworks]);

  return (
    <section id="artworks-collage" ref={containerRef} className="py-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      {/* Editorial Collage Grid */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-16 sm:gap-y-24 items-start">
        {artworks.map((artwork, idx) => {
          // Dynamic sizing configuration based on aspect ratio
          let colSpan = artwork.colSpan || 'col-span-12 md:col-span-6';
          let aspectClass = 'aspect-[4/3]';

          if (artwork.aspect === 'panoramic') {
            aspectClass = 'aspect-[16/9] sm:aspect-[16/8]';
          } else if (artwork.aspect === 'portrait') {
            aspectClass = 'aspect-[3/4] sm:aspect-[4/5]';
          } else if (artwork.aspect === 'square') {
            aspectClass = 'aspect-square';
          } else if (artwork.aspect === 'landscape') {
            aspectClass = 'aspect-[16/10]';
          }

          return (
            <div
              key={artwork.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={`${colSpan} ${artwork.offsetClass || ''} group relative cursor-pointer`}
              onClick={() => onSelectArtwork(artwork)}
            >
              {/* Image Frame with overflow hidden for parallax & smooth scale */}
              <div className="relative overflow-hidden bg-stone-200 border border-stone-200/80 rounded-xs transition-shadow duration-500 group-hover:shadow-xl">
                <div className={`artwork-img-container relative w-full ${aspectClass} transition-transform duration-700 ease-out group-hover:scale-[1.025]`}>
                  <Image
                    src={artwork.image}
                    alt={`${artwork.title} - ${artwork.location}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
                    className="object-cover transition-all duration-700 filter group-hover:contrast-105"
                    referrerPolicy="no-referrer"
                    priority={idx < 3}
                  />

                  {/* Gentle hover vignette / scrim */}
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-500" />

                  {/* Corner Fullscreen Affordance Icon */}
                  <div className="absolute top-4 right-4 p-2 bg-stone-900/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xs transform translate-y-1 group-hover:translate-y-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
