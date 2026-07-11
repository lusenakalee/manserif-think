import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { EXHIBIT_BY_SLUG_QUERY } from '@/lib/sanity/queries/exhibits';
import { notFound } from 'next/navigation';
import ExhibitPageClient from './ExhibitPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exhibit = await client.fetch(EXHIBIT_BY_SLUG_QUERY, { slug });

  if (!exhibit) return {};

  const rawDescription =
    typeof exhibit.exhibitDescription === 'string'
      ? exhibit.exhibitDescription.slice(0, 160)
      : exhibit.subtitle ?? null;

  const description: string =
    rawDescription
      ?? `Explore "${exhibit.title}" — an exhibit on ManSerif.Think by Warren Kamau.`;

  const ogImageUrl = exhibit.heroImage
    ? urlFor(exhibit.heroImage).width(1200).height(630).fit('crop').url()
    : undefined; // ← undefined, not null

  return {
    title: exhibit.title ?? undefined,           // ← null → undefined
    description,
    openGraph: {
      title: exhibit.title ?? undefined,         // ← null → undefined
      description,
      url: `https://www.manserifthink.com/exhibits/${slug}`,
      type: 'article',
      ...(ogImageUrl
        ? {
            images: [{
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: exhibit.heroImage?.alt ?? exhibit.title ?? undefined, // ← null → undefined
            }],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: exhibit.title ?? undefined,         // ← null → undefined
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export default async function ExhibitPage({ params }: PageProps) {
  const { slug } = await params;
  const exhibit = await client.fetch(EXHIBIT_BY_SLUG_QUERY, { slug });

  if (!exhibit) {
    notFound();
  }

  const heroImageUrl = exhibit.heroImage
    ? urlFor(exhibit.heroImage).width(1920).height(1080).url()
    : null;

  return <ExhibitPageClient exhibit={exhibit} heroImageUrl={heroImageUrl} />;
}