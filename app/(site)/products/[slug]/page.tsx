import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";

const siteUrl = "https://www.manserifthink.com";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function buildDescription(product: any) {
  if (product.description) return product.description;

  const details = [product.material, product.dimensions]
    .filter(Boolean)
    .join(" · ");

  return `${product.name}${details ? ` (${details})` : ""} — original artwork by Warren Kamau, available now from the Manserif.Think studio.`;
}

// PRODUCT_BY_SLUG_QUERY already dereferences asset->url, so each image is
// { _key, asset: { _id, url }, hotspot }. Sanity's CDN accepts resize
// params directly on that url — no urlFor()/image-url package needed here.
function sanityImageUrl(url?: string | null, params = "w=1200&auto=format") {
  if (!url) return undefined;
  return `${url}?${params}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Same query as the page below — Next.js dedupes identical fetches made
  // during the same render, so this doesn't cost a second request.
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    return {
      title: "Artwork not found",
    };
  }

  const title = product.name ?? "Untitled artwork";
  const description = buildDescription(product);

  const ogImageUrl =
    sanityImageUrl(product.images?.[0]?.asset?.url, "w=1200&h=630&fit=crop&auto=format") ??
    "/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  const title = product.name ?? "Untitled artwork";
  const description = buildDescription(product);

  // Product structured data (schema.org) — this is what lets Google show
  // price and availability directly in search results for this page.
  // Currency below is set to GBP to match the Sanity schema; change to
  // KES if that's not actually right for this store.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: product.images
      ?.map((img: any) => sanityImageUrl(img.asset?.url))
      .filter(Boolean),
    sku: slug,
    brand: {
      "@type": "Brand",
      name: "Manserif.Think",
    },
    ...(product.category?.title && { category: product.category.title }),
    ...(product.dimensions && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Dimensions",
          value: product.dimensions,
        },
      ],
    }),
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${slug}`,
      priceCurrency: "GBP",
      price: product.price,
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <ProductGallery images={product.images} productName={title} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}