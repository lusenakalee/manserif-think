'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface CategoryItem {
  id: string;
  title: string;
  href: string;
  image: string;
  alt: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'art-exhibition',
    title: 'ART EXHIBITION',
    href: '/art-exhibition',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=2000&q=85',
    alt: 'Spatial light installation and immersive art exhibition in a gallery',
  },
  {
    id: 'communion',
    title: 'COMMUNION',
    href: '/communion',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    alt: 'Monumental architectural timber and curved communal structure',
  },
  {
    id: 'art-works',
    title: 'ART WORKS',
    href: '/art-works',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
    alt: 'Luminous sculptural form exploring light, glass, and materiality',
  },
  {
    id: 'portfolio',
    title: 'PORTOLIO',
    href: '/portfolio',
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=2000&q=85',
    alt: 'Large-scale outdoor architectural pavilion under open sky',
  },
];

interface CategoryGridProps {
  categories?: CategoryItem[];
}

export default function CategoryGrid({ categories = CATEGORIES }: CategoryGridProps) {
  return (
    <nav
      aria-label="Studio Main Categories"
      className="w-full h-auto md:h-screen md:h-dvh overflow-x-hidden"
    >
      {/* 
        Grid Specifications:
        Desktop: 2x2 grid filling 100vw x 100vh / 100dvh.
                 grid-template-columns: repeat(2, minmax(0, 1fr));
                 grid-template-rows: repeat(2, minmax(0, 1fr));
                 No outer margins, no gaps (gap-0).
                 Each panel is ~ 50vw x 50vh.
        Mobile:  Single-column layout.
                 grid-template-columns: 1fr;
                 grid-template-rows: repeat(4, 50vh);
                 Each panel is 100vw x 50vh.
                 First two categories fill initial mobile viewport (2 x 50vh = 100vh),
                 with the remaining two continuing below.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[repeat(4,50vh)] md:grid-rows-2 h-auto md:h-full w-full gap-0 p-0 m-0">
        {categories.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            aria-label={`${item.title} — view category`}
            className="group relative w-full h-[50vh] md:h-full block overflow-hidden select-none bg-neutral-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90 z-0"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
                referrerPolicy="no-referrer"
                className="object-cover object-center w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] will-change-transform"
              />
            </div>

            {/* 
              Subtle Dark Overlay:
              Preserves photography while guaranteeing high-contrast typography.
            */}
            <div
              className="absolute inset-0 bg-black/25 transition-colors duration-500 ease-out group-hover:bg-black/20"
              aria-hidden="true"
            />

            {/* 
              Centered Category Title:
              Desktop: font-size clamp(2rem, 4vw, 5rem); font-weight 700-800; tracking tight/neutral; white.
              Mobile: font-size clamp(2rem, 9vw, 3.5rem);
              Subtle scale/move on hover: group-hover:scale-[1.03]
            */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-10 pointer-events-none">
              <h2
                className="text-white font-extrabold uppercase text-center leading-[0.95] tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] will-change-transform drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] text-[clamp(2rem,9vw,3.5rem)] md:text-[clamp(2rem,4vw,5rem)] max-w-[90%]"
              >
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
