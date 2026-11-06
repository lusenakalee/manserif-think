import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { CATEGORY_PAGE_QUERY } from '@/lib/sanity/queries/categories';
import CategoryPageClient from './CategoryPageClient';
import {
  CategoryPagePayload,
  CollageItem,
} from '@/types/category';

// ─── Layout normalization ─────────────────────────────────────────────────────

const ASPECTS: CollageItem['aspect'][] = [
  'landscape', 'portrait', 'landscape', 'square', 'panoramic', 'portrait',
];

const COL_SPANS = [
  'col-span-12 md:col-span-8',
  'col-span-12 md:col-span-4',
  'col-span-12 md:col-span-6',
  'col-span-12 md:col-span-6',
  'col-span-12',
  'col-span-12 md:col-span-7',
  'col-span-12 md:col-span-5',
];

const OFFSETS = [
  '', 'md:mt-16', '', 'md:mt-8', '', 'md:mt-24', 'md:mt-4',
];

function normalizeToCollageItems(data: CategoryPagePayload): CollageItem[] {
  const all: CollageItem[] = [];

  for (const item of (data.art ?? [])) {
    if (!item.slug || !item.heroImage?.url) continue;
    all.push({
      id:              item._id,
      _type:           'art',
      slug:            item.slug,
      title:           item.title ?? 'Untitled',
      image:           item.heroImage.url,
      lqip:            item.heroImage.lqip,
      hotspot:         item.heroImage.hotspot,
      aspect:          'landscape',
      colSpan:         '',
      offsetClass:     '',
      subcategorySlug: item.subcategorySlug,
      detail: {
        _type:       'art',
        description: item.description,
        price:       item.price,
        material:    item.material,
        dimensions:  item.dimensions,
        stock:       item.stock,
      },
    });
  }

  for (const item of (data.exhibits ?? [])) {
    if (!item.slug || !item.heroImage?.url) continue;
    all.push({
      id:              item._id,
      _type:           'exhibit',
      slug:            item.slug,
      title:           item.title ?? 'Untitled',
      image:           item.heroImage.url,
      lqip:            item.heroImage.lqip,
      hotspot:         item.heroImage.hotspot,
      aspect:          'landscape',
      colSpan:         '',
      offsetClass:     '',
      subcategorySlug: item.subcategorySlug,
      detail: {
        _type:               'exhibit',
        subtitle:            item.subtitle,
        exhibitDescription:  item.exhibitDescription,
        startDateTime:       item.startDateTime,
        endDateTime:         item.endDateTime,
        venueName:           item.venueName,
        venueCity:           item.venueCity,
        venueCountry:        item.venueCountry,
        venueMapsUrl:        item.venueMapsUrl,
      },
    });
  }

  for (const item of (data.projects ?? [])) {
    if (!item.slug || !item.heroImage?.url) continue;
    all.push({
      id:              item._id,
      _type:           'project',
      slug:            item.slug,
      title:           item.title ?? 'Untitled',
      image:           item.heroImage.url,
      lqip:            item.heroImage.lqip,
      hotspot:         item.heroImage.hotspot,
      aspect:          'landscape',
      colSpan:         '',
      offsetClass:     '',
      subcategorySlug: item.subcategorySlug,
      detail: {
        _type:       'project',
        subtitle:    item.subtitle,
        description: item.description,
        location:    item.location,
        note:        item.note,
      },
    });
  }

  for (const item of (data.apparel ?? [])) {
  if (!item.slug || !item.heroImage?.url) continue;
  all.push({
    id:              item._id,
    _type:           'apparel',
    slug:            item.slug,
    title:           item.title ?? 'Untitled',
    image:           item.heroImage.url,
    lqip:            item.heroImage.lqip,
    hotspot:         item.heroImage.hotspot,
    aspect:          'landscape',
    colSpan:         '',
    offsetClass:     '',
    subcategorySlug: item.subcategorySlug,
    detail: {
      _type:            'apparel',
      description:      item.description,
      price:            item.price,
      apparelKind:      item.apparelKind,
      gender:           item.gender,
      material:         item.material,
      materialDetail:   item.materialDetail,
      features:         item.features,
      careInstructions: item.careInstructions,
      availableSizes:   item.availableSizes,
      shoeSizes:        item.shoeSizes,
      stock:            item.stock,
      limitedEdition:   item.limitedEdition,
    },
  });
}

  all.forEach((item, idx) => {
    item.aspect      = ASPECTS[idx % ASPECTS.length];
    item.colSpan     = COL_SPANS[idx % COL_SPANS.length];
    item.offsetClass = OFFSETS[idx % OFFSETS.length];
  });

  return all;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getObjectPosition(
  hotspot?: { x?: number | null; y?: number | null } | null
): string {
  if (!hotspot?.x || !hotspot?.y) return 'center';
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 60 } }
  );
  return slugs.map(({ slug }) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await client.fetch<{ title: string; description?: string } | null>(
    `*[_type == "category" && slug.current == $slug][0]{ title, description }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return {
    title:       data?.title ?? 'Category',
    description: data?.description ?? undefined,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await client.fetch<CategoryPagePayload | null>(
    CATEGORY_PAGE_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!data) notFound();

  const items = normalizeToCollageItems(data);

  const paragraphs = (data.description ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const shortDescription = paragraphs[0] ?? '';
  const fullDescription  = paragraphs.slice(1).join('\n\n');

  const heroImage  = data.image;
  const heroAlt    = heroImage?.alt ?? data.title;
  const heroPos    = getObjectPosition(heroImage?.hotspot);

  return (
    <div className="bg-stone-50">
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-stone-200">

        {/* Category image */}
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: heroPos }}
            placeholder={heroImage.lqip ? 'blur' : 'empty'}
            blurDataURL={heroImage.lqip ?? undefined}
          />
        )}

        {/* Gradient: transparent at top → stone-50 at bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-stone-50/0 from-30% to-stone-50"
          aria-hidden="true"
        />

        {/* Category title + Back to Home, anchored to bottom of hero.
            flex-col-reverse stacks Back to Home above the title on small
            screens; sm:flex-row puts it to the right of the title instead. */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8">
          <div className="flex flex-col-reverse sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6">
            <h1 className="font-serif italic font-normal leading-[0.95] tracking-tight text-stone-900 text-[clamp(2.8rem,6vw,8rem)]">
              {data.title}
            </h1>

            <a
              href="/"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm group shrink-0"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Interactive content ──────────────────────────────────────────────── */}
      <CategoryPageClient
        categoryTitle={data.title}
        categorySlug={data.slug}
        shortDescription={shortDescription}
        fullDescription={fullDescription}
        subcategories={data.subcategories ?? []}
        items={items}
      />
    </div>
  );
}