import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { EXHIBIT_BY_SLUG_QUERY } from '@/lib/sanity/queries/exhibits';
import { notFound } from 'next/navigation';
import ExhibitPageClient from './ExhibitPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
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