import Image from 'next/image'

const sculptures = [
  {
    id: 1,
    name: 'Tension Arc',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1620503374956-c942862f0372?w=800&auto=format&fit=crop',
    imageAlt: 'Abstract bronze sculpture with a sweeping curved arc rising from a marble plinth.',
    price: '€8,500',
    material: 'Bronze',
    dimensions: '62 × 28 × 18 cm',
  },
  {
    id: 2,
    name: 'Vessel IV',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
    imageAlt: 'Hand-thrown ceramic vessel with an ash glaze in muted greens and greys.',
    price: '€1,100',
    material: 'Stoneware Ceramic',
    dimensions: '38 × 22 × 22 cm',
  },
  {
    id: 3,
    name: 'Untitled (Weight)',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    imageAlt: 'Cast iron block sculpture with a surface of rough hand-worked texture.',
    price: '€4,200',
    material: 'Cast Iron',
    dimensions: '40 × 40 × 30 cm',
  },
  {
    id: 4,
    name: 'Figure, Standing',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
    imageAlt: 'Elongated carved wood figure in pale ash with a smooth contemplative form.',
    price: '€3,600',
    material: 'Carved Ash Wood',
    dimensions: '90 × 18 × 14 cm',
  },
]

export default function SculpturesSnippet() {
  return (
    <div className="bg-stone-900">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
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
            href="#"
            className="hidden sm:inline-block font-mono text-xs text-stone-500 underline decoration-stone-700 underline-offset-4 hover:text-stone-200 transition-colors"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sculptures.map((sculpture) => (
            <div key={sculpture.id} className="group relative">
              <div className="overflow-hidden bg-stone-800 aspect-[3/4] lg:aspect-auto lg:h-80 relative">
                <Image
                  src={sculpture.imageSrc}
                  alt={sculpture.imageAlt}
                  fill
                  className="object-cover opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
              </div>

              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-base text-stone-100 italic">
                    <a href={sculpture.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {sculpture.name}
                    </a>
                  </h3>
                  <p className="mt-1 font-mono text-xs text-stone-500 uppercase tracking-widest">
                    {sculpture.material}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-stone-600">
                    {sculpture.dimensions}
                  </p>
                </div>
                <p className="font-mono text-sm text-stone-400">{sculpture.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}