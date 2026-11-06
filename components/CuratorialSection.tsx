'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CategorySubcategory } from '@/types/category';

interface CuratorialSectionProps {
  shortDescription: string;
  fullDescription?: string;
  subcategories: CategorySubcategory[];
  activeSubcategory: string;
  onSelectSubcategory: (slug: string) => void;
  itemCount: number;
}

export default function CuratorialSection({
  shortDescription,
  fullDescription,
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
  itemCount,
}: CuratorialSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFullDescription = !!fullDescription?.trim();

  const fullParagraphs = fullDescription
    ? fullDescription.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <section
      id="exhibition-header"
      // pt reduced — hero header above provides the top visual space.
      // If your navbar is fixed and taller than ~3rem, increase pt-10 accordingly.
      className="pt-10 pb-12 sm:pt-14 sm:pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
    >
      {/* Lead paragraph (first chunk of description) */}
      {shortDescription && (
        <div className="mt-8 max-w-3xl">
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-sans font-light">
            {shortDescription}
          </p>

          {hasFullDescription && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:underline"
              >
                <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expandable full description */}
      {isExpanded && hasFullDescription && (
        <div
          id="curatorial-essay"
          className="mt-10 pt-8 border-t border-stone-200 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="max-w-3xl space-y-6 text-stone-700 font-light leading-relaxed">
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Category Statement · ManSerif.Think
            </div>

            {fullParagraphs.map((para, i) => (
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
          </div>
        </div>
      )}

      {/* Filter bar: All Works + subcategory buttons */}
      <div className="mt-12 pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectSubcategory('all')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
              activeSubcategory === 'all'
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            All Works ({itemCount})
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => onSelectSubcategory(sub.slug)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer whitespace-nowrap ${
                activeSubcategory === sub.slug
                  ? 'bg-stone-900 text-stone-50 font-medium'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              {sub.title}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-400 uppercase tracking-widest hidden sm:block">
          Click any piece to inspect details
        </div>
      </div>
    </section>
  );
}