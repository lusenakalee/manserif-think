'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { EXHIBITION_INFO } from '@/data/exhibition-data';

interface CuratorialSectionProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  artworkCount: number;
}

export default function CuratorialSection({
  activeCategory,
  onSelectCategory,
  artworkCount
}: CuratorialSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="exhibition-header" className="pt-28 pb-12 sm:pt-36 sm:pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      {/* Top Meta Line: Title, Venue, Dates, Back Link */}
      <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 pb-6 border-b border-stone-200/80 text-stone-700 text-sm sm:text-base">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <h1 className="font-serif text-lg sm:text-xl text-stone-900">
            <span className="italic font-normal">Le Divin à Travers Mes Yeux</span>, {EXHIBITION_INFO.subtitle}
          </h1>
          <span className="text-stone-500 text-sm whitespace-nowrap">
            {EXHIBITION_INFO.dates}
          </span>
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-sm group shrink-0"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </a>
      </div>

      {/* Main Curatorial Lead Paragraph */}
      <div className="mt-8 max-w-3xl">
        <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-sans font-light">
          {EXHIBITION_INFO.shortDescription}
        </p>

        {/* Read More / Read Less Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:underline"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Curatorial Essay */}
      {isExpanded && (
        <div id="curatorial-essay" className="mt-10 pt-8 border-t border-stone-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 cols: Curatorial essay text */}
            <div className="lg:col-span-7 space-y-6 text-stone-700 font-light leading-relaxed">
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                Curatorial Statement · Manserif.Think & DIASONAMA Foundation
              </div>
              
              {EXHIBITION_INFO.fullCuratorialEssay.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'first-letter:text-4xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-2.5 first-letter:text-stone-900 text-stone-800'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}

              {/* Curatorial Quote */}
              <div className="py-6 my-4 border-y border-stone-200">
                <blockquote className="font-serif italic text-lg sm:text-xl text-stone-900 leading-snug">
                  “{EXHIBITION_INFO.fullCuratorialEssay.quote}”
                </blockquote>
                <cite className="block text-xs uppercase tracking-wider text-stone-500 not-italic mt-3">
                  — {EXHIBITION_INFO.fullCuratorialEssay.quoteAttribution}
                </cite>
              </div>
            </div>

            {/* Right 5 cols: Curatorial Themes */}
            <div className="lg:col-span-5 lg:border-l lg:border-stone-200 lg:pl-10 space-y-6">
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                Exhibition Vectors
              </div>

              <div className="space-y-6">
                {EXHIBITION_INFO.fullCuratorialEssay.themes.map((theme, i) => (
                  <div key={i} className="pb-5 border-b border-stone-100 last:border-0">
                    <h3 className="font-serif text-base text-stone-900 font-medium mb-1.5">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-stone-100/70 border border-stone-200/60 rounded-sm text-xs text-stone-600 space-y-2">
                <div className="font-medium text-stone-800 uppercase tracking-wider">
                  Paris Solo Presentation
                </div>
                <p>
                  Presented at La Galerie (12 Rue de Turenne, Paris) in partnership with the DIASONAMA Foundation, showcasing past and forthcoming multidisciplinary projects, short films, and fine art editions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curatorial Filter Controls / Media Categorization */}
      <div className="mt-12 pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            All Works ({artworkCount})
          </button>
          <button
            onClick={() => onSelectCategory('iconography')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeCategory === 'iconography'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Iconography & Contemplation
          </button>
          <button
            onClick={() => onSelectCategory('dialogue')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeCategory === 'dialogue'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Live Dialogues
          </button>
          <button
            onClick={() => onSelectCategory('installations')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeCategory === 'installations'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Suspended Installations
          </button>
          <button
            onClick={() => onSelectCategory('studies')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeCategory === 'studies'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Studies & Prints
          </button>
        </div>

        <div className="text-xs text-stone-400 uppercase tracking-widest hidden sm:block">
          Click any piece to inspect details in high resolution
        </div>
      </div>
    </section>
  );
}
