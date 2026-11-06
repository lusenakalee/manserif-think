'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  CollageItem,
  ArtDetail,
  ExhibitDetail,
  ProjectDetail,
} from '@/types/category';
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
  ExternalLink,
  Info,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(start?: string | null, end?: string | null): string | null {
  if (!start) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

function getStartYear(dt?: string | null): string | null {
  if (!dt) return null;
  return new Date(dt).getFullYear().toString();
}

function getFigureLabel(item: CollageItem, index: number): string {
  const prefix =
    item._type === 'art'     ? 'Fig.'  :
    item._type === 'exhibit' ? 'Exh.'  : 'Proj.';
  return `${prefix} ${(index + 1).toString().padStart(2, '0')}`;
}

// ─── Detail sub-components ────────────────────────────────────────────────────

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans">
        {label}
      </dt>
      <dd className="text-stone-800 mt-1 text-sm font-sans">{children}</dd>
    </div>
  );
}

function ArtDetailFields({ detail }: { detail: ArtDetail }) {
  return (
    <>
      {detail.material && (
        <DetailRow label="Material & Medium">{detail.material}</DetailRow>
      )}

      {detail.dimensions && (
        <DetailRow label="Dimensions">
          <span className="font-mono text-xs">{detail.dimensions}</span>
        </DetailRow>
      )}

      {/* {typeof detail.price === 'number' && (
        <DetailRow label="Price">
          £{detail.price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
        </DetailRow>
      )} */}

      {/* {typeof detail.stock === 'number' && (
        <DetailRow label="Availability">
          {detail.stock > 0 ? (
            <span className="text-stone-700">{detail.stock} in stock</span>
          ) : (
            <span className="text-stone-400 italic">Sold Out</span>
          )}
        </DetailRow>
      )} */}

      {detail.description && (
        <div className="pt-3 border-t border-stone-100">
          <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans mb-1.5">
            Description
          </dt>
          <dd className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
            {detail.description}
          </dd>
        </div>
      )}
    </>
  );
}

function ExhibitDetailFields({ detail }: { detail: ExhibitDetail }) {
  const dateRange = formatDateRange(detail.startDateTime, detail.endDateTime);
  const venueParts = [detail.venueName, detail.venueCity, detail.venueCountry]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {detail.subtitle && (
        <DetailRow label="Subtitle">{detail.subtitle}</DetailRow>
      )}

      {venueParts && (
        <div>
          <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans">
            Venue
          </dt>
          <dd className="text-stone-800 mt-1 flex items-start gap-1.5 text-xs font-sans">
            <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
            <span>
              {venueParts}
              {detail.venueMapsUrl && (
                <a
                  href={detail.venueMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 inline-flex items-center gap-0.5 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label="Open venue on Google Maps"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </span>
          </dd>
        </div>
      )}

      {dateRange && (
        <DetailRow label="Dates">{dateRange}</DetailRow>
      )}

      {detail.exhibitDescription && (
        <div className="pt-3 border-t border-stone-100">
          <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans mb-1.5">
            About the Exhibition
          </dt>
          <dd className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
            {detail.exhibitDescription}
          </dd>
        </div>
      )}
    </>
  );
}

function ProjectDetailFields({ detail }: { detail: ProjectDetail }) {
  return (
    <>
      {detail.subtitle && (
        <DetailRow label="Subtitle">{detail.subtitle}</DetailRow>
      )}

      {detail.location && (
        <DetailRow label="Medium / Location">{detail.location}</DetailRow>
      )}

      {detail.note && (
        <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xs">
          <dt className="text-[11px] uppercase tracking-wider text-stone-600 font-medium font-sans mb-1">
            Note
          </dt>
          <dd className="text-stone-600 text-xs leading-relaxed">
            {detail.note}
          </dd>
        </div>
      )}

      {detail.description && (
        <div className="pt-3 border-t border-stone-100">
          <dt className="text-[11px] uppercase tracking-widest text-stone-500 font-medium font-sans mb-1.5">
            Description
          </dt>
          <dd className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
            {detail.description}
          </dd>
        </div>
      )}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ArtworkLightboxProps {
  items: CollageItem[];
  selectedItem: CollageItem | null;
  onClose: () => void;
  onSelectItem: (item: CollageItem) => void;
}

export default function ArtworkLightbox({
  items,
  selectedItem,
  onClose,
  onSelectItem,
}: ArtworkLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  const currentIndex = items.findIndex((a) => a.id === selectedItem?.id);

  const handleNext = useCallback(() => {
    if (!items.length) return;
    const next =
      currentIndex < items.length - 1 ? items[currentIndex + 1] : items[0];
    onSelectItem(next);
    setZoomLevel(1);
  }, [currentIndex, items, onSelectItem]);

  const handlePrev = useCallback(() => {
    if (!items.length) return;
    const prev =
      currentIndex > 0 ? items[currentIndex - 1] : items[items.length - 1];
    onSelectItem(prev);
    setZoomLevel(1);
  }, [currentIndex, items, onSelectItem]);

  const handleZoomIn  = () => setZoomLevel((p) => Math.min(p + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(p - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')                  onClose();
      else if (e.key === 'ArrowRight')          handleNext();
      else if (e.key === 'ArrowLeft')           handlePrev();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-')                   handleZoomOut();
      else if (e.key.toLowerCase() === 'i')    setShowInfo((p) => !p);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, onClose, handleNext, handlePrev]);

  // Lock body scroll
useEffect(() => {
  if (selectedItem) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
  } else {
    document.body.style.overflow = '';
    document.body.classList.remove('lightbox-open');
  }
  return () => {
    document.body.style.overflow = '';
    document.body.classList.remove('lightbox-open');
  };
}, [selectedItem]);

  if (!selectedItem) return null;

  const figureLabel = getFigureLabel(selectedItem, currentIndex);
  const { detail }  = selectedItem;

  // Year shown in header — exhibits only (from startDateTime)
  const headerYear =
    detail._type === 'exhibit' ? getStartYear(detail.startDateTime) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-50/98 backdrop-blur-md flex flex-col justify-between text-stone-900 select-none animate-in fade-in duration-200 "
      role="dialog"
      aria-modal="true"
      aria-label={`Inspection: ${selectedItem.title}`}
    >
      {/* ── Top Utility Bar ─────────────────────────────────────────────────── */}
      <header className="px-4 sm:px-6 py-3 border-b border-stone-200 bg-white/95 backdrop-blur-xs flex items-center justify-between text-xs tracking-widest uppercase gap-3">
        {/* Left: figure label + title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-sans text-[11px] sm:text-xs text-stone-500 shrink-0">
            {figureLabel}
          </span>
          <span className="text-stone-300 shrink-0">/</span>
          <span className="text-stone-900 font-medium font-serif normal-case text-xs sm:text-sm tracking-normal truncate max-w-[120px] sm:max-w-none">
            {selectedItem.title}
          </span>
          {headerYear && (
            <span className="text-stone-400 font-sans hidden lg:inline">
              ({headerYear})
            </span>
          )}
        </div>

        {/* Center: Zoom controls */}
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

        {/* Right: Toggle details + Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-sm border text-[11px] sm:text-xs tracking-wider font-sans transition-all cursor-pointer ${
              showInfo
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500 hover:text-stone-950'
            }`}
            title="Toggle details (I)"
            aria-expanded={showInfo}
          >
            {showInfo ? (
              <><PanelRightClose className="w-3.5 h-3.5" /><span>Hide</span></>
            ) : (
              <><PanelRightOpen className="w-3.5 h-3.5 text-stone-600" /><span className="font-medium">Details</span></>
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

      {/* ── Main Stage + Detail Panel ────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-100/40">
        {/* Image viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden min-h-[300px]">
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full border border-stone-200/90 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            title="Previous (Left arrow)"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 rounded-full border border-stone-200/90 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            title="Next (Right arrow)"
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Mobile: show details button when panel is hidden */}
          {!showInfo && (
            <button
              onClick={() => setShowInfo(true)}
              className="md:hidden absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white shadow-lg rounded-full text-xs font-sans tracking-wide active:scale-95 transition-all cursor-pointer border border-stone-800"
              aria-label="Show item details"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Show Details</span>
            </button>
          )}

          {/* Scalable image canvas */}
          <div
            className="relative max-w-5xl max-h-[72vh] w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={selectedItem.image}
              alt={selectedItem.title}
              fill
              className="object-contain drop-shadow-xs"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Detail Panel (toggleable) */}
        {showInfo && (
          <aside className="w-full md:w-84 lg:w-96 max-h-[48vh] md:max-h-none border-t md:border-t-0 md:border-l border-stone-200 bg-white flex flex-col justify-between overflow-y-auto shrink-0 z-20 transition-all duration-300 animate-in slide-in-from-right-4">
            <div className="p-6 sm:p-7 space-y-6">
              {/* Panel header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200/90">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                    {figureLabel}
                    {headerYear ? ` · ${headerYear}` : ''}
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 font-normal mt-1 leading-snug">
                    {selectedItem.title}
                  </h3>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="text-stone-400 hover:text-stone-800 p-1 -mr-1 transition-colors cursor-pointer"
                  title="Hide details"
                  aria-label="Hide details panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic detail fields */}
              <dl className="space-y-4 text-xs font-light leading-relaxed">
                {detail._type === 'art'     && <ArtDetailFields     detail={detail} />}
                {detail._type === 'exhibit' && <ExhibitDetailFields detail={detail} />}
                {detail._type === 'project' && <ProjectDetailFields detail={detail} />}
              </dl>
            </div>

            {/* Panel footer */}
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 text-[11px] text-stone-500 flex items-center justify-between">
              <span>{currentIndex + 1} of {items.length} Works</span>
              <span className="uppercase tracking-widest">ManSerif.Think</span>
            </div>
          </aside>
        )}
      </div>

      {/* ── Thumbnail Strip ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-stone-200 px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="text-xs text-stone-500 tracking-wider font-sans hidden md:block">
          {currentIndex + 1} of {items.length} Selected Works
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full scrollbar-none mx-auto">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onSelectItem(item); setZoomLevel(1); }}
              className={`relative w-12 h-9 sm:w-16 sm:h-11 rounded-xs overflow-hidden shrink-0 border transition-all cursor-pointer ${
                item.id === selectedItem.id
                  ? 'border-stone-900 ring-2 ring-stone-900/20 scale-105 opacity-100 shadow-xs'
                  : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-400'
              }`}
              title={item.title}
              aria-label={`View ${item.title}`}
            >
              <Image
                src={item.image}
                alt={item.title}
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