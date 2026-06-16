'use client'
import Lenis from 'lenis';
import React, { useEffect } from 'react'
import Section from './Section';
import { urlFor } from '@/sanity/lib/image'; // adjust this import to wherever your image-url builder lives
import type { ALL_EXHIBITS_QUERY_RESULT } from '@/sanity.types'; // adjust path to wherever typegen writes sanity.types.ts

type Exhibit = ALL_EXHIBITS_QUERY_RESULT[number];

// Narrows out any exhibit missing a slug, since there's nowhere for "Learn More" to link to without one.
// Asserting the inner `{ current: string }` shape directly (rather than NonNullable<Exhibit['slug']>)
// matters here because Sanity's generated `Slug` type marks `current` itself as optional —
// just stripping `null` off the outer `slug` field still leaves `current: string | undefined`.
function hasSlug(
  exhibit: Exhibit
): exhibit is Exhibit & { slug: { current: string } } {
  return Boolean(exhibit.slug?.current);
}

export default function VideoSnippets({
  exhibits,
}: {
  exhibits: ALL_EXHIBITS_QUERY_RESULT;
}) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div>
      {exhibits.filter(hasSlug).map((exhibit) => {
        const heroVideoUrl = exhibit.heroVideo?.asset?.url ?? undefined;
        const heroImageUrl = exhibit.heroImage?.asset
          ? urlFor(exhibit.heroImage).width(1920).height(1080).url()
          : undefined;

        return (
          <Section
            key={exhibit._id}
            video={heroVideoUrl}
            image={heroImageUrl}
            imageAlt={exhibit.heroImage?.alt ?? undefined}
            tag={exhibit.subtitle ?? ''}
            title={exhibit.title ?? ''}
            description={exhibit.exhibitDescription ?? ''}
            slug={exhibit.slug.current}
          />
        );
      })}
    </div>
  );
}