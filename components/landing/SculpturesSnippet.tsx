import { Suspense } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  SNIPPET_PRODUCTS_BY_CATEGORY_QUERY,
  type SnippetProduct,
} from "@/lib/sanity/queries/products";
import { AddToCartButton } from "@/components/general/AddToCartButton";
import { SculpturesSnippetSkeleton } from "@/components/landing/SculpturesSnippetSkeleton";

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_SCULPTURES: SnippetProduct[] = [
  {
    _id: "fallback-1",
    name: "Tension Arc",
    slug: "tension-arc",
    price: 8500,
    featured: false,
    material: "Bronze",
    color: null,
    dimensions: "62 × 28 × 18 cm",
    image: {
      url: "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=800&auto=format&fit=crop",
      alt: "Abstract bronze sculpture with a sweeping curved arc rising from a marble plinth.",
    },
  },
  {
    _id: "fallback-2",
    name: "Vessel IV",
    slug: "vessel-iv",
    price: 1100,
    featured: false,
    material: "Stoneware Ceramic",
    color: null,
    dimensions: "38 × 22 × 22 cm",
    image: {
      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop",
      alt: "Hand-thrown ceramic vessel with an ash glaze in muted greens and greys.",
    },
  },
  {
    _id: "fallback-3",
    name: "Untitled (Weight)",
    slug: "untitled-weight",
    price: 4200,
    featured: false,
    material: "Cast Iron",
    color: null,
    dimensions: "40 × 40 × 30 cm",
    image: {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
      alt: "Cast iron block sculpture with a surface of rough hand-worked texture.",
    },
  },
  {
    _id: "fallback-4",
    name: "Figure, Standing",
    slug: "figure-standing",
    price: 3600,
    featured: false,
    material: "Carved Ash Wood",
    color: null,
    dimensions: "90 × 18 × 14 cm",
    image: {
      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop",
      alt: "Elongated carved wood figure in pale ash with a smooth contemplative form.",
    },
  },
];

// ─── Inner async component ────────────────────────────────────────────────────

async function SculpturesSnippetInner() {
  const raw = await client
    .fetch<SnippetProduct[]>(SNIPPET_PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug: "sculptures",
    })
    .catch(() => null);

  const sculptures = raw?.length ? raw : FALLBACK_SCULPTURES;

  return (
    <div className="bg-stone-900">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
              Three-Dimensional Works
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-100">
              Sculptures
            </h2>
          </div>
          <a
            href="/sculptures"
            className="hidden sm:inline-block font-mono text-xs text-stone-500 underline decoration-stone-700 underline-offset-4 hover:text-stone-200 transition-colors"
          >
            View all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sculptures.map((sculpture) => (
            <div key={sculpture._id} className="group relative flex flex-col">
              {/* Image */}
              <div className="overflow-hidden bg-stone-800 aspect-[3/4] lg:aspect-auto lg:h-80 relative">
                {sculpture.image?.url ? (
                  <Image
                    src={sculpture.image.url}
                    alt={sculpture.image.alt ?? sculpture.name}
                    fill
                    className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
                {sculpture.featured && (
                  <span className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-widest bg-stone-100 text-stone-900 px-2 py-0.5">
                    Featured
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base text-stone-100 italic">
                    <a href={`/sculptures/${sculpture.slug}`}>{sculpture.name}</a>
                  </h3>
                  {sculpture.material && (
                    <p className="mt-1 font-mono text-xs text-stone-500 uppercase tracking-widest">
                      {sculpture.material}
                    </p>
                  )}
                  {sculpture.dimensions && (
                    <p className="mt-0.5 font-mono text-xs text-stone-600">
                      {sculpture.dimensions}
                    </p>
                  )}
                </div>
                <p className="font-mono text-sm text-stone-400">
                  €{sculpture.price.toLocaleString()}
                </p>
              </div>

              {/* Add to cart */}
              <div className="mt-4">
                <AddToCartButton
                  productId={sculpture._id}
                  name={sculpture.name}
                  price={sculpture.price}
                  image={sculpture.image?.url}
                  stock={1} // swap for sculpture.stock once field is added to SNIPPET_PRODUCTS_BY_CATEGORY_QUERY
                  className="font-mono text-xs tracking-widest uppercase border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700"
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

export default function SculpturesSnippet() {
  return (
    <Suspense fallback={<SculpturesSnippetSkeleton />}>
      <SculpturesSnippetInner />
    </Suspense>
  );
}