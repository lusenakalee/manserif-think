import InfiniteGallery from '@/components/general/InfiniteGallery';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { ALL_EXHIBITS_QUERY } from '@/lib/sanity/queries/exhibits';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type GalleryImage = {
  src: string;
  alt: string;
  title?: string;
  href?: string;
};

export default async function Page() {
  const exhibits = await client.fetch(ALL_EXHIBITS_QUERY);

  const sampleImages: GalleryImage[] = exhibits
    .map((exhibit): GalleryImage | null => {
      if (!exhibit?.heroImage?.asset) {
        return null;
      }

      const slug =
        typeof exhibit.slug === 'object' && exhibit.slug !== null
          ? exhibit.slug.current
          : undefined;

      return {
        src: urlFor(exhibit.heroImage)
          .width(1600)
          .height(900)
          .fit('crop')
          .url(),

        alt:
          exhibit.heroImage?.alt ||
          exhibit.title ||
          'Exhibit image',

        title: exhibit.title ?? undefined,

        // Links to:
        // /exhibits/[slug]
        href: slug ? `/exhibits/${slug}` : undefined,
      };
    })
    .filter((image): image is GalleryImage => image !== null);

  return (
    <main className="min-h-screen bg-black">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full rounded-lg overflow-hidden"
      />

      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
          <span className="italic">I exhibit;</span> therefore I am seen
        </h1>
      </div>

      <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-60">
          Auto-play resumes after 3 seconds of inactivity
        </p>
      </div>
    </main>
  );
}