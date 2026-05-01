// components/landing/skeletons/ArtSnippetSkeleton.tsx
// Drop this in as the <Suspense fallback> or loading.tsx for ArtSnippet.

import { ProductCardSkeleton } from "@/components/landing/ProductCardSkeleton";

export function ArtSnippetSkeleton() {
  return (
    <div className="bg-[#F3F0E7]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header skeleton */}
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-sm bg-stone-300 animate-pulse" />
            <div className="h-7 w-40 rounded-sm bg-stone-300 animate-pulse" />
          </div>
          <div className="hidden sm:block h-3 w-16 rounded-sm bg-stone-300 animate-pulse" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} theme="light" />
          ))}
        </div>
      </div>
    </div>
  );
}