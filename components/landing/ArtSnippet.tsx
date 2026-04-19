import Image from 'next/image'

const artworks = [
  {
    id: 1,
    name: 'Fractured Horizon',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop',
    imageAlt: 'Abstract oil painting with deep blues and fractured golden lines across a dark horizon.',
    price: '€1,200',
    medium: 'Oil on Canvas',
  },
  {
    id: 2,
    name: 'Solitude No. 4',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1552084117-56a987666449?w=800&auto=format&fit=crop',
    imageAlt: 'Minimalist charcoal drawing of a lone figure against a pale textured background.',
    price: '€850',
    medium: 'Charcoal on Paper',
  },
  {
    id: 3,
    name: 'Chromatic Bloom',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop',
    imageAlt: 'Vivid acrylic painting of an abstracted floral form in warm reds, oranges and yellows.',
    price: '€2,400',
    medium: 'Acrylic on Board',
  },
  {
    id: 4,
    name: 'Still — After Rain',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop',
    imageAlt: 'Watercolour landscape of a misty valley rendered in soft greys and sage greens.',
    price: '€640',
    medium: 'Watercolour',
  },
]

export default function ArtSnippet() {
  return (
    <div className="bg-[#F3F0E7]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
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
            href="#"
            className="hidden sm:inline-block font-mono text-xs text-stone-500 underline decoration-stone-400/50 underline-offset-4 hover:text-stone-900 transition-colors"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="group relative">
              <div className="overflow-hidden rounded-sm bg-stone-200 aspect-[3/4] lg:aspect-auto lg:h-80 relative">
                <Image
                  src={artwork.imageSrc}
                  alt={artwork.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base text-stone-900">
                    <a href={artwork.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {artwork.name}
                    </a>
                  </h3>
                  <p className="mt-1 font-mono text-xs text-stone-500 uppercase tracking-widest">
                    {artwork.medium}
                  </p>
                </div>
                <p className="font-mono text-sm text-stone-700">{artwork.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}