import Preloader from '@/components/landing/Preloader'
import Image from 'next/image'
import React from 'react'

export default function HeroSection() {
  return (
    <div className="h-screen w-screen relative">
      <Preloader />

      <div className="relative z-10 flex h-screen w-screen flex-col overflow-hidden bg-[#E0DCD7] pl-20 pt-24 pr-12 pb-16 md:pl-28 md:pt-32">
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-14 left-0 right-0 h-px bg-[#c9c4c4]/80" />
          <div className="absolute top-0 bottom-0 left-14 w-px bg-[#c9c4c4]/80" />
        </div>

        {/* Hero text */}
        <main className="relative z-10 max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-stone-600/90">
            Art | Garments | Furniture | Photographs | Sculptures
          </p>
          <h1 className="mt-6 text-4xl font-medium leading-[1.12] tracking-tight text-stone-900 md:text-5xl">
            ManSerif.Think
            <br />
            <span className="text-stone-600">Design with <br /> Intent.</span>
          </h1>
          <p className="mt-12 max-w-[18rem] border-l border-stone-500/35 pl-5 font-mono text-sm leading-relaxed text-stone-600">
            Code as craft — structure, clarity, and the space between.
          </p>
        </main>

        <a
          href="mailto:hello@dimaac.com"
          className="relative z-10 mt-auto font-mono text-sm text-stone-600 underline decoration-stone-400/50 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-600/60"
        >
          warrenkamau.art@outlook.com
        </a>

        {/* Permanent SVG figure — bottom-right, always visible beneath the preloader */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          <Image
            src="/images/manserif-man.svg"
            alt="ManSerif figure"
            width={220}
            height={340}
            className="h-[40vh] w-auto max-h-[340px] object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  )
}