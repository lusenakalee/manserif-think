// components/landing/skeletons/ProductCardSkeleton.tsx
// A single shimmer card that mirrors the shape of a product card.
// Pass `theme="dark"` for the Sculptures dark background.

interface ProductCardSkeletonProps {
  theme?: "light" | "warm" | "dark";
  showDimensions?: boolean;
}

export function ProductCardSkeleton({
  theme = "light",
  showDimensions = false,
}: ProductCardSkeletonProps) {
  const shimmer =
    theme === "dark"
      ? "bg-stone-700/60 animate-pulse"
      : theme === "warm"
        ? "bg-stone-300/70 animate-pulse"
        : "bg-stone-200/90 animate-pulse";

  const textLine =
    theme === "dark" ? "bg-stone-700 animate-pulse" : "bg-stone-300 animate-pulse";

  return (
    <div className="group relative">
      {/* Image placeholder */}
      <div
        className={`rounded-sm aspect-[3/4] lg:aspect-auto lg:h-80 w-full ${shimmer}`}
      />

      {/* Text placeholders */}
      <div className="mt-4 flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className={`h-4 w-3/4 rounded-sm ${textLine}`} />
          {/* Material / colour */}
          <div className={`h-3 w-1/2 rounded-sm ${textLine}`} />
          {/* Dimensions — only shown for sculptures */}
          {showDimensions && (
            <div className={`h-3 w-2/5 rounded-sm ${textLine}`} />
          )}
        </div>
        {/* Price */}
        <div className={`h-4 w-12 rounded-sm flex-shrink-0 ${textLine}`} />
      </div>

      {/* Add to cart button placeholder */}
      <div className={`mt-4 h-11 w-full rounded-md ${shimmer}`} />
    </div>
  );
}