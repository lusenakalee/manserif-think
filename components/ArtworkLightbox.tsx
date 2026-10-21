'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/exhibition';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  PanelRightClose,
  PanelRightOpen,
  MapPin,
  Maximize2,
  Info
} from 'lucide-react';

interface ArtworkLightboxProps {
  artworks: Artwork[];
  selectedArtwork: Artwork | null;
  onClose: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
}

export default function ArtworkLightbox({
  artworks,
  selectedArtwork,
  onClose,
  onSelectArtwork
}: ArtworkLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  const currentIndex = artworks.findIndex((a) => a.id === selectedArtwork?.id);

  const handleNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      onSelectArtwork(artworks[currentIndex + 1]);
      setZoomLevel(1);
    } else {
      onSelectArtwork(artworks[0]);
      setZoomLevel(1);
    }
  }, [currentIndex, artworks, onSelectArtwork]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectArtwork(artworks[currentIndex - 1]);
      setZoomLevel(1);
    } else {
      onSelectArtwork(artworks[artworks.length - 1]);
      setZoomLevel(1);
    }
  }, [currentIndex, artworks, onSelectArtwork]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedArtwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key.toLowerCase() === 'i') {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtwork, onClose, handleNext, handlePrev]);

  // Lock body scroll when open
  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtwork]);

  if (!selectedArtwork) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-50/98 backdrop-blur-md flex flex-col justify-between text-stone-900 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Artwork inspection: ${selectedArtwork.title}`}
    >
      {/* Top Utility Bar (White Gallery Aesthetic) */}
      <header className="px-4 sm:px-6 py-3 border-b border-stone-200 bg-white/95 backdrop-blur-xs flex items-center justify-between text-xs tracking-widest uppercase gap-3">
        {/* Left: Exhibition / Artwork Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-serif italic text-sm text-stone-500 normal-case hidden md:inline">
            Le Divin à Travers Mes Yeux ·
          </span>
          <span className="text-stone-500 font-sans text-[11px] sm:text-xs shrink-0">{selectedArtwork.figureNumber}</span>
          <span className="text-stone-300 shrink-0">/</span>
          <span className="text-stone-900 font-medium font-serif normal-case text-xs sm:text-sm tracking-normal truncate max-w-[120px] sm:max-w-none">
            {selectedArtwork.title}
          </span>
          <span className="text-stone-400 font-sans hidden lg:inline">({selectedArtwork.year})</span>
        </div>

        {/* Center: Clean Zoom Controls */}
        <div className="flex items-center gap-1 bg-stone-100/90 border border-stone-200/90 rounded-sm px-1.5 sm:px-2 py-1 shrink-0">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1 hover:text-stone-950 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-stone-700 px-1 font-mono tabular-nums">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-1 hover:text-stone-950 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-stone-950 text-stone-500 transition-colors ml-1 border-l border-stone-200 pl-1.5 cursor-pointer"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right: Toggle Accession Details Section & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-sm border text-[11px] sm:text-xs tracking-wider font-sans transition-all cursor-pointer ${
              showInfo
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500 hover:text-stone-950'
            }`}
            title="Toggle accession details (I)"
            aria-expanded={showInfo}
          >
            {showInfo ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5 text-stone-600" />
                <span className="font-medium">Details</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer rounded-sm border border-transparent hover:border-stone-200"
            title="Close viewer (Esc)"
            aria-label="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Stage + Optional Right Accession Section */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-100/40">
        {/* Left/Center Artwork Viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden min-h-[300px]">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full border border-stone-200/90 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            title="Previous artwork (Left arrow)"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full border border-stone-200/90 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            title="Next artwork (Right arrow)"
            aria-label="Next artwork"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Floating Show Details Button on Mobile when hidden */}
          {!showInfo && (
            <button
              onClick={() => setShowInfo(true)}
              className="md:hidden absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white shadow-lg rounded-full text-xs font-sans tracking-wide active:scale-95 transition-all cursor-pointer border border-stone-800"
              aria-label="Show artwork accession details"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Show Details</span>
            </button>
          )}

          {/* Scalable Image Canvas */}
          <div
            className="relative max-w-5xl max-h-[72vh] w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={selectedArtwork.image}
              alt={selectedArtwork.title}
              fill
              className="object-contain drop-shadow-xs"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Accession Details Section (Toggleable) */}
        {showInfo && (
          <aside className="w-full md:w-84 lg:w-96 max-h-[48vh] md:max-h-none border-t md:border-t-0 md:border-l border-stone-200 bg-white flex flex-col justify-between overflow-y-auto shrink-0 z-20 transition-all duration-300 animate-in slide-in-from-right-4">
            <div className="p-6 sm:p-7 space-y-6">
              {/* Accession Section Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200/90">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                    {selectedArtwork.figureNumber} · {selectedArtwork.year}
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 font-normal mt-1 leading-snug">
                    {selectedArtwork.title}
                  </h3>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="text-stone-400 hover:text-stone-800 p-1 -mr-1 transition-colors cursor-pointer"
                  title="Hide details section"
                  aria-label="Hide details section"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Accession Details List */}
              <dl className="space-y-4 text-xs font-light leading-relaxed">
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans">
                    Medium & Technique
                  </dt>
                  <dd className="text-stone-800 mt-1 text-sm font-sans">
                    {selectedArtwork.medium}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans">
                    Dimensions
                  </dt>
                  <dd className="text-stone-800 mt-1 font-mono text-xs">
                    {selectedArtwork.dimensions}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans">
                    Gallery Location
                  </dt>
                  <dd className="text-stone-800 mt-1 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{selectedArtwork.location}</span>
                  </dd>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans mb-1.5">
                    Curatorial Commentary
                  </dt>
                  <dd className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                    {selectedArtwork.curatorialDescription}
                  </dd>
                </div>

                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xs">
                  <dt className="text-[11px] uppercase tracking-wider text-stone-600 font-medium font-sans mb-1">
                    Theological & Dialogue Notes:
                  </dt>
                  <dd className="text-stone-600 text-xs leading-relaxed">
                    {selectedArtwork.dialogueNote}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Sidebar Footer info */}
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 text-[11px] text-stone-500 flex items-center justify-between">
              <span>{currentIndex + 1} of {artworks.length} Works</span>
              <span className="uppercase tracking-widest">La Galerie Paris</span>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Thumbnail Strip (White Gallery Aesthetic) */}
      <footer className="bg-white border-t border-stone-200 px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="text-xs text-stone-500 tracking-wider font-sans hidden md:block">
          {currentIndex + 1} of {artworks.length} Selected Works
        </div>

        {/* Thumbnail Reel */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full scrollbar-none mx-auto">
          {artworks.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                onSelectArtwork(art);
                setZoomLevel(1);
              }}
              className={`relative w-12 h-9 sm:w-16 sm:h-11 rounded-xs overflow-hidden shrink-0 border transition-all cursor-pointer ${
                art.id === selectedArtwork.id
                  ? 'border-stone-900 ring-2 ring-stone-900/20 scale-105 opacity-100 shadow-xs'
                  : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-400'
              }`}
              title={art.title}
              aria-label={`View ${art.title}`}
            >
              <Image
                src={art.image}
                alt={art.title}
                fill
                className="object-cover"
                sizes="64px"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-400 tracking-wider font-sans hidden md:block">
          Use ← → keys or click thumbnails
        </div>
      </footer>
    </div>
  );
}
