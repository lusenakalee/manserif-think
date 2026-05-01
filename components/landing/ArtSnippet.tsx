import { Suspense } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  SNIPPET_PRODUCTS_BY_CATEGORY_QUERY,
  type SnippetProduct,
} from "@/lib/sanity/queries/products";
import { AddToCartButton } from "@/components/general/AddToCartButton";
import { ArtSnippetSkeleton } from "@/components/landing/ArtSnippetSkeleton";

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_ART: SnippetProduct[] = [
  {
    _id: "fallback-1",
    name: "Fractured Horizon",
    slug: "fractured-horizon",
    price: 1200,
    featured: false,
    material: "Oil on Canvas",
    color: null,
    dimensions: null,
    image: {
      url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop",
      alt: "Abstract oil painting with deep blues and fractured golden lines across a dark horizon.",
    },
  },
  {
    _id: "fallback-2",
    name: "Solitude No. 4",
    slug: "solitude-no-4",
    price: 850,
    featured: false,
    material: "Charcoal on Paper",
    color: null,
    dimensions: null,
    image: {
      url: "https://images.unsplash.com/photo-1552084117-56a987666449?w=800&auto=format&fit=crop",
      alt: "Minimalist charcoal drawing of a lone figure against a pale textured background.",
    },
  },
  {
    _id: "fallback-3",
    name: "Chromatic Bloom",
    slug: "chromatic-bloom",
    price: 2400,
    featured: false,
    material: "Acrylic on Board",
    color: null,
    dimensions: null,
    image: {
      url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop",
      alt: "Vivid acrylic painting of an abstracted floral form.",
    },
  },
  {
    _id: "fallback-4",
    name: "Still — After Rain",
    slug: "still-after-rain",
    price: 640,
    featured: false,
    material: "Watercolour",
    color: null,
    dimensions: null,
    image: {
      url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop",
      alt: "Watercolour landscape of a misty valley.",
    },
  },
];

// ─── Inner async component ────────────────────────────────────────────────────

async function ArtSnippetInner() {
  const raw = await client
    .fetch<SnippetProduct[]>(SNIPPET_PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug: "art",
    })
    .catch(() => null);

  const artworks = raw?.length ? raw : FALLBACK_ART;

  return (
    <div className="bg-[#F3F0E7]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
              Original Works
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900">
              Art Collection
            </h2>
          </div>
          <a
            href="/art"
            className="hidden sm:inline-block font-mono text-xs text-stone-500 underline decoration-stone-400/50 underline-offset-4 hover:text-stone-900 transition-colors"
          >
            View all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {artworks.map((artwork) => (
            <div key={artwork._id} className="group relative flex flex-col">
              {/* Image */}
              <div className="overflow-hidden rounded-sm bg-stone-200 aspect-[3/4] lg:aspect-auto lg:h-80 relative">
                {artwork.image?.url ? (
                  <Image
                    src={artwork.image.url}
                    alt={artwork.image.alt ?? artwork.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-300" />
                )}
                {artwork.featured && (
                  <span className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-widest bg-stone-900 text-stone-100 px-2 py-0.5">
                    Featured
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base text-stone-900">
                    <a href={`/art/${artwork.slug}`}>{artwork.name}</a>
                  </h3>
                  {artwork.material && (
                    <p className="mt-1 font-mono text-xs text-stone-500 uppercase tracking-widest">
                      {artwork.material}
                    </p>
                  )}
                </div>
                <p className="font-mono text-sm text-stone-700">
                  €{artwork.price.toLocaleString()}
                </p>
              </div>

              {/* Add to cart */}
              <div className="mt-4">
                <AddToCartButton
                  productId={artwork._id}
                  name={artwork.name}
                  price={artwork.price}
                  image={artwork.image?.url}
                  stock={1} // swap for artwork.stock once field is added to SNIPPET_PRODUCTS_BY_CATEGORY_QUERY
                  className="font-mono text-xs tracking-widest uppercase"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Public export wrapped in Suspense ───────────────────────────────────────

export default function ArtSnippet() {
  return (
    <Suspense fallback={<ArtSnippetSkeleton />}>
      <ArtSnippetInner />
    </Suspense>
  );
}