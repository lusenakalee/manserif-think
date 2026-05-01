import { Suspense } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  SNIPPET_PRODUCTS_BY_CATEGORY_QUERY,
  type SnippetProduct,
} from "@/lib/sanity/queries/products";
import { AddToCartButton } from "@/components/general/AddToCartButton";
import { GarmentsSnippetSkeleton } from "@/components/landing/GarmentsSnippetSkeleton";

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_GARMENTS: SnippetProduct[] = [
  {
    _id: "fallback-1",
    name: "Basic Tee",
    slug: "basic-tee-black",
    price: 35,
    featured: false,
    material: null,
    color: "Black",
    dimensions: null,
    image: {
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
      alt: "Front of men's Basic Tee in black.",
    },
  },
  {
    _id: "fallback-2",
    name: "Basic Tee",
    slug: "basic-tee-white",
    price: 35,
    featured: false,
    material: null,
    color: "Aspen White",
    dimensions: null,
    image: {
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
      alt: "Front of men's Basic Tee in white.",
    },
  },
  {
    _id: "fallback-3",
    name: "Basic Tee",
    slug: "basic-tee-charcoal",
    price: 35,
    featured: false,
    material: null,
    color: "Charcoal",
    dimensions: null,
    image: {
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
      alt: "Front of men's Basic Tee in dark gray.",
    },
  },
  {
    _id: "fallback-4",
    name: "Artwork Tee",
    slug: "artwork-tee-iso-dots",
    price: 35,
    featured: false,
    material: null,
    color: "Iso Dots",
    dimensions: null,
    image: {
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
      alt: "Front of men's Artwork Tee in peach.",
    },
  },
];

// ─── Inner async component ────────────────────────────────────────────────────

async function GarmentsSnippetInner() {
  const raw = await client
    .fetch<SnippetProduct[]>(SNIPPET_PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug: "garments",
    })
    .catch(() => null);

  const products = raw?.length ? raw : FALLBACK_GARMENTS;

  return (
    <div className="bg-[#E0DCD7]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
              Wearable Works
            </p>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900">
              Garments
            </h2>
          </div>
          <a
            href="/garments"
            className="hidden sm:inline-block font-mono text-xs text-stone-500 underline decoration-stone-400/50 underline-offset-4 hover:text-stone-900 transition-colors"
          >
            View all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product._id} className="group relative flex flex-col">
              {/* Image */}
              <div className="overflow-hidden rounded-sm bg-stone-300 aspect-square lg:aspect-auto lg:h-80 relative">
                {product.image?.url ? (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt ?? product.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-300" />
                )}
                {product.featured && (
                  <span className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-widest bg-stone-900 text-stone-100 px-2 py-0.5">
                    Featured
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base text-stone-900">
                    <a href={`/garments/${product.slug}`}>{product.name}</a>
                  </h3>
                  {product.color && (
                    <p className="mt-1 font-mono text-xs text-stone-500 uppercase tracking-widest">
                      {product.color}
                    </p>
                  )}
                </div>
                <p className="font-mono text-sm text-stone-700">
                  €{product.price.toLocaleString()}
                </p>
              </div>

              {/* Add to cart */}
              <div className="mt-4">
                <AddToCartButton
                  productId={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image?.url}
                  stock={1} // swap for product.stock once field is added to SNIPPET_PRODUCTS_BY_CATEGORY_QUERY
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

export default function GarmentsSnippet() {
  return (
    <Suspense fallback={<GarmentsSnippetSkeleton />}>
      <GarmentsSnippetInner />
    </Suspense>
  );
}