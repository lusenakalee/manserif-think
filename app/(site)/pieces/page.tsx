import InfiniteGallery from '@/components/general/InfiniteGallery';
import { client } from '@/sanity/lib/client'; // adjust to your actual client export
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity/queries/products';

export default async function page() {
    const products = await client.fetch(ALL_PRODUCTS_QUERY);

    // images[] is already dereferenced (asset->{ _id, url }) in the query,
    // so no image-url builder is needed here — just read .url directly.
    //
    // NOTE: make sure ALL_PRODUCTS_QUERY projects a `slug` field, e.g.
    //   "slug": slug.current
    // otherwise `product.slug` will be undefined and the image won't link.
    const sampleImages = products
        .map((product) => {
            const src = product?.images?.[0]?.asset?.url;
            if (!src) return null;

            return {
                src,
                alt: product.name || 'Piece image',
                href: product.slug ? `/projects/${product.slug}` : undefined,
            };
        })
        .filter(
            (image): image is { src: string; alt: string; href?: string } =>
                image !== null
        );

    return (
        <main className="min-h-screen ">
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
                    <span className="italic">I create;</span> therefore I am
                </h1>
            </div>

            <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
                <p>Use mouse wheel, arrow keys, or touch to navigate</p>
                <p className=" opacity-60">
                    Auto-play resumes after 3 seconds of inactivity
                </p>
            </div>
        </main>
    );
}