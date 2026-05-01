'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  src: string;
  alt: string;
  speed?: number;
}

interface ScrollingGalleryProps {
  images: GalleryImage[];
  className?: string;
  id?: string;
}

export default function ScrollingGallery({
  images,
  className = '',
  id = 'gallery',
}: ScrollingGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Image layout config: alternating sizes + vertical offsets for dynamic feel
  const layouts = [
    { w: 'w-[420px]', h: 'h-[560px]', mt: 'mt-[60px]' },
    { w: 'w-[300px]', h: 'h-[400px]', mt: 'mt-[-40px]' },
    { w: 'w-[380px]', h: 'h-[500px]', mt: 'mt-[100px]' },
    { w: 'w-[260px]', h: 'h-[360px]', mt: 'mt-[20px]' },
    { w: 'w-[440px]', h: 'h-[580px]', mt: 'mt-[-20px]' },
    { w: 'w-[320px]', h: 'h-[440px]', mt: 'mt-[80px]' },
  ];

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    // Horizontal scroll illusion
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${scrollDistance + 200}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, {
      x: -scrollDistance,
      ease: 'none',
    });

    // Skew images on scroll velocity
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${scrollDistance + 200}`,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const skew = gsap.utils.clamp(-6, 6)(velocity / -150);
        gsap.to(`#${id} .gallery-img`, {
          skewY: skew,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });

    // Staggered reveal on load
    gsap.from(`#${id} .gallery-item`, {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.3,
    });

    // Large title letter animation
    gsap.from('.title-letter', {
      opacity: 0,
      y: 120,
      duration: 1.2,
      stagger: 0.06,
      ease: 'expo.out',
      delay: 0.1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { dependencies: [images.length, id], scope: containerRef });

  // Lightbox keyboard close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const titleLetters = 'MANSERIF'.split('');

  return (
    <>
      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={900}
              className="object-contain max-h-[85vh] max-w-[88vw] rounded-sm"
              style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
              aria-label="Close"
            >
              ×
            </button>
            <p className="text-white/50 text-xs mt-3 text-center font-mono tracking-widest uppercase">
              {lightbox.alt} · ESC to close
            </p>
          </div>
        </div>
      )}

      {/* ── Main pinned section ── */}
      <div
        ref={containerRef}
        id={id}
        className={`relative overflow-hidden bg-[#0d0d0d] ${className}`}
        style={{ height: '100vh' }}
      >
        {/* Sticky background with huge title */}
        <div
          ref={stickyRef}
          className="absolute inset-0 flex items-center justify-start pointer-events-none z-0 pl-[6vw]"
        >
          <h1
            className="select-none leading-none flex overflow-hidden"
            style={{
              fontFamily: '"Playfair Display", "Georgia", serif',
              fontSize: 'clamp(100px, 18vw, 280px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.08)',
              letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            {titleLetters.map((letter, i) => (
              <span
                key={i}
                className="title-letter inline-block"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Grain overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Horizontal scrolling track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center z-10"
          style={{ paddingLeft: '8vw', paddingRight: '12vw', gap: '3vw', willChange: 'transform' }}
        >
          {/* Opening label */}
          <div className="flex-shrink-0 flex flex-col justify-center mr-[4vw]">
            <p
              className="text-white/20 uppercase tracking-[0.4em] text-xs mb-2"
              style={{ fontFamily: '"DM Mono", "Courier New", monospace' }}
            >
              Collection
            </p>
            <div className="w-px h-24 bg-white/10 ml-1" />
          </div>

          {images.map((img, index) => {
            const layout = layouts[index % layouts.length];
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className={`gallery-item flex-shrink-0 relative cursor-zoom-in ${layout.w} ${layout.h} ${layout.mt}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setLightbox(img)}
              >
                {/* Image wrapper */}
                <div
                  className="gallery-img w-full h-full overflow-hidden relative"
                  style={{
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center"
                    style={{
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-black/40 flex items-end p-4"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <span
                      className="text-white text-xs uppercase tracking-widest"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      View ↗
                    </span>
                  </div>
                </div>

                {/* Index number */}
                <span
                  className="absolute -top-6 left-0 text-white/20 text-xs"
                  style={{ fontFamily: '"DM Mono", monospace', letterSpacing: '0.2em' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            );
          })}

          {/* End marker */}
          <div className="flex-shrink-0 flex flex-col justify-center ml-[4vw]">
            <p
              className="text-white/15 uppercase tracking-[0.4em] text-xs writing-mode-vertical"
              style={{
                fontFamily: '"DM Mono", monospace',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              End of collection
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60"
        >
          <span
            className="text-white/40 text-[10px] uppercase tracking-[0.5em]"
            style={{ fontFamily: '"DM Mono", monospace' }}
          >
            Scroll
          </span>
          <div className="w-px h-12 bg-white/20 animate-pulse" />
        </div>
      </div>
    </>
  );
}

export { ScrollingGallery };