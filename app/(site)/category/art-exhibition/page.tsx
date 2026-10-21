"use client";

import React, { useState, useMemo } from "react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CuratorialSection from "@/components/CuratorialSection";
import AbstractArtCollage from "@/components/AbstractArtCollage";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import { ARTWORKS } from "@/data/exhibition-data";
import { Artwork } from "@/types/exhibition";

export default function Page() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter artworks by category if selected
  const filteredArtworks = useMemo(() => {
    if (activeCategory === "all") return ARTWORKS;
    return ARTWORKS.filter((art) => art.roomCategory === activeCategory);
  }, [activeCategory]);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-50 font-sans antialiased">
        <main>
          {/* Curatorial Header, Metadata, & Expandable Essay */}
          <CuratorialSection
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            artworkCount={filteredArtworks.length}
          />

          {/* Abstract Editorial Art Collage with GSAP ScrollTrigger Parallax */}
          <AbstractArtCollage
            artworks={filteredArtworks}
            onSelectArtwork={(art) => setSelectedArtwork(art)}
          />
        </main>

        {/* Fullscreen Minimal Artwork Lightbox Viewer */}
        <ArtworkLightbox
          artworks={filteredArtworks}
          selectedArtwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
        />
      </div>
    </SmoothScrollProvider>
  );
}
