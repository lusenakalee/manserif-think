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
  lqip?: string | null;
}

/** Shown only if Sanity has no categories marked "Show on landing grid". */
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
    href: '/pieces',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
    alt: 'Luminous sculptural form exploring light, glass, and materiality',
  },
  {
    id: 'portfolio',
    title: 'PORTFOLIO',
    href: '/portfolio',
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=2000&q=85',
    alt: 'Large-scale outdoor architectural pavilion under open sky',
  },
];

/**
 * Loose shape accepted from Sanity. Generated query types mark most fields as
 * nullable, so they're validated and narrowed to CategoryItem below.
 */
export interface CategoryInput {
  id: string;
  title?: string | null;
  href?: string | null;
  image?: string | null;
  alt?: string | null;
  lqip?: string | null;
}

interface CategoryGridProps {
  categories?: CategoryInput[] | null;
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Keep only complete categories from Sanity; otherwise use the fallback tiles
  const fromCms = (categories ?? []).flatMap((c): CategoryItem[] =>
    c.title && c.href && c.image
      ? [
          {
            id: c.id,
            title: c.title,
            href: c.href,
            image: c.image,
            alt: c.alt || c.title,
            lqip: c.lqip,
          },
        ]
      : []
  );
  const items = fromCms.length ? fromCms : CATEGORIES;
  const isOdd = items.length % 2 === 1;

  return (
    <nav
      aria-label="Studio Main Categories"
      className="w-full overflow-x-hidden"
    >
      {/*
        Grid:
        Mobile:  single column, every tile 100vw x 50vh.
        Desktop: 2 columns, every tile 50vw x 50dvh. Four tiles fill the screen
                 exactly; more tiles keep adding rows below.
                 If the count is odd, the last tile spans both columns.
        Row counts are passed as CSS variables so any number of tiles works.
      */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 grid-rows-[repeat(var(--rows-m),50vh)] md:grid-rows-[repeat(var(--rows-d),50dvh)] w-full gap-0 p-0 m-0"
        style={
          {
            '--rows-m': items.length,
            '--rows-d': Math.ceil(items.length / 2),
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => {
          const spanFull = isOdd && index === items.length - 1;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={`${item.title} — view category`}
              className={`group relative w-full h-[50vh] md:h-full block overflow-hidden select-none bg-neutral-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90 z-0 ${
                spanFull ? 'md:col-span-2' : ''
              }`}
            >
              {/* Background Image Container */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes={
                    spanFull
                      ? '100vw'
                      : '(max-width: 768px) 100vw, 50vw'
                  }
                  priority={index < 2}
                  referrerPolicy="no-referrer"
                  className="object-cover object-center w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] will-change-transform"
                  {...(item.lqip
                    ? { placeholder: 'blur' as const, blurDataURL: item.lqip }
                    : {})}
                />
              </div>

              {/* Subtle dark overlay for text contrast */}
              <div
                className="absolute inset-0 bg-black/25 transition-colors duration-500 ease-out group-hover:bg-black/20"
                aria-hidden="true"
              />

              {/* Centered category title */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-10 pointer-events-none">
                <h2 className="text-white font-extrabold uppercase text-center leading-[0.95] tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] will-change-transform drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] text-[clamp(2rem,9vw,3.5rem)] md:text-[clamp(2rem,4vw,5rem)] max-w-[90%]">
                  {item.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}