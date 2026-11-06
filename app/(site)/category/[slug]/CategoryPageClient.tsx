'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CuratorialSection from '@/components/CuratorialSection';
import AbstractArtCollage from '@/components/AbstractArtCollage';
import ArtworkLightbox from '@/components/ArtworkLightbox';
import { CollageItem, CategorySubcategory } from '@/types/category';

interface CategoryPageClientProps {
  categoryTitle: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription?: string;
  subcategories: CategorySubcategory[];
  items: CollageItem[];
}

export default function CategoryPageClient({
  categoryTitle,
  categorySlug,
  shortDescription,
  fullDescription,
  subcategories,
  items,
}: CategoryPageClientProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<CollageItem | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // art-exhibition → clicking routes to /exhibits/[slug], no lightbox
  const isExhibitionCategory = categorySlug === 'art-exhibition';

  // Filter by subcategory slug
  const filteredItems = useMemo(() => {
    if (activeSubcategory === 'all') return items;
    return items.filter((item) => item.subcategorySlug === activeSubcategory);
  }, [items, activeSubcategory]);

  // Click handler: route or open lightbox
  const handleSelectItem = useCallback(
    (item: CollageItem) => {
      if (isExhibitionCategory) {
        router.push(`/exhibits/${item.slug}`);
      } else {
        setSelectedItem(item);
      }
    },
    [isExhibitionCategory, router]
  );

  // Subcategory change also clears any open lightbox
  const handleSelectSubcategory = useCallback((slug: string) => {
    setActiveSubcategory(slug);
    setSelectedItem(null);
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-50 font-sans antialiased">
        <main>
          <CuratorialSection
            shortDescription={shortDescription}
            fullDescription={fullDescription}
            subcategories={subcategories}
            activeSubcategory={activeSubcategory}
            onSelectSubcategory={handleSelectSubcategory}
            itemCount={filteredItems.length}
          />

          <AbstractArtCollage
            items={filteredItems}
            onSelectItem={handleSelectItem}
          />
        </main>

        {/* Lightbox — not rendered for art-exhibition category */}
        {!isExhibitionCategory && (
          <ArtworkLightbox
            items={filteredItems}
            selectedItem={selectedItem}
            onClose={() => setSelectedItem(null)}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}
      </div>
    </SmoothScrollProvider>
  );
}
