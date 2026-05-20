'use client';

import ExhibitDetails from '@/components/exhibits/ExhibitDetails';
import { urlFor } from '@/sanity/lib/image';
import { EXHIBIT_BY_SLUG_QUERY_RESULT } from '@/sanity.types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface ExhibitPageClientProps {
  exhibit: NonNullable<EXHIBIT_BY_SLUG_QUERY_RESULT>;
  heroImageUrl: string | null;
}

export default function ExhibitPageClient({ exhibit, heroImageUrl }: ExhibitPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const scrollTween = gsap.to(wrapper, {
      x: () => -(wrapper.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set('.progress-bar', { scaleX: self.progress });
        },
      },
    });

    gsap.utils.toArray('.reveal-text').forEach((text: any) => {
      gsap.fromTo(
        text,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            containerAnimation: scrollTween,
            start: 'left right-=100',
          },
        }
      );
    });

    gsap.utils.toArray('.reveal-image-wrapper').forEach((wrapper: any) => {
      const imageContainer = wrapper.querySelector('.reveal-image');
      const image = wrapper.querySelector('img');

      gsap.fromTo(
        imageContainer,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: scrollTween,
            start: 'left right-=150',
          },
        }
      );

      gsap.fromTo(
        image,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: scrollTween,
            start: 'left right-=150',
          },
        }
      );
    });

    const tl = gsap.timeline();
    tl.fromTo(
      '.hero-title',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
    ).fromTo(
      '.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=1'
    );
  }, { scope: containerRef });

  const location = exhibit.exhibitLocation;
  const partners = exhibit.partners ?? [];
  const images = exhibit.images ?? [];
  const featuredProducts = exhibit.featuredProducts ?? [];

  return (
    <main ref={containerRef} className="h-[100vh] w-full overflow-hidden bg-[#F5F2ED]">
      {/* Scroll Progress Indicator */}
      <div className="progress-bar fixed top-0 left-0 h-1.5 bg-[#1A1A1A] z-[100] w-full origin-left scale-x-0 mix-blend-difference" />

      <div ref={wrapperRef} className="flex h-full w-max will-change-transform">

        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <section className="relative h-screen w-screen shrink-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={exhibit.heroImage?.alt ?? exhibit.title ?? ''}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10 text-center text-[#F5F2ED] px-6">
            <div className="overflow-hidden mb-6">
              <h1 className="hero-title font-serif text-7xl md:text-9xl font-light tracking-tight">
                {exhibit.title}
              </h1>
            </div>
            <p className="hero-subtitle text-sm md:text-base uppercase tracking-[0.3em] font-medium">
              {location?.venueName ?? exhibit.subtitle}
            </p>
          </div>
        </section>

        {/* ── Exhibit Details ───────────────────────────────────────────────── */}
        <ExhibitDetails
          title={exhibit.title ?? ''}
          subtitle={exhibit.subtitle ?? ''}
          exhibitDescription={exhibit.exhibitDescription ?? ''}
          artistDescription={exhibit.artistDescription ?? ''}
        />

        {/* ── Featured Products ─────────────────────────────────────────────── */}
        {featuredProducts.length > 0 && (
          <section className="h-screen w-max shrink-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-[#1A1A1A]">
            <div className="mb-10">
              <div className="overflow-hidden mb-2">
                <p className="reveal-text text-xs uppercase tracking-[0.3em] text-gray-500">
                  From this Exhibition
                </p>
              </div>
              <div className="overflow-hidden">
                <h2 className="reveal-text font-serif text-3xl md:text-5xl font-light text-[#F5F2ED]">
                  Featured Works
                </h2>
              </div>
            </div>

            <div className="flex gap-6 h-[55vh]">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug?.current}`}
                  className="reveal-text group relative flex flex-col justify-end w-[28vw] min-w-[220px] max-w-[360px] h-full border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/30 hover:bg-white/10"
                >
                  {/* Index number */}
                  <span className="absolute top-5 left-5 text-xs uppercase tracking-[0.3em] text-gray-600 font-light">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Subtle diagonal accent */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-white/5 via-transparent to-transparent" />

                  {/* Product info */}
                  <div className="relative z-10 p-6 border-t border-white/10 group-hover:border-white/20 transition-colors duration-300">
                    <p className="text-[#F5F2ED] font-serif text-lg md:text-xl font-light leading-snug mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {product.title}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      View Work →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery Images ────────────────────────────────────────────────── */}
        {images.map((img, index) => {
          const imgUrl = img ? urlFor(img).width(1600).height(900).url() : null;
          if (!imgUrl) return null;

          return (
            <section
              key={index}
              className="relative h-screen w-screen md:w-auto shrink-0 flex items-center justify-center px-8 md:px-12 bg-white"
            >
              <div
                className={`reveal-image-wrapper relative w-full aspect-[4/3] md:w-auto md:h-[70vh] ${
                  index % 2 === 0 ? 'md:aspect-[16/9]' : 'md:aspect-[3/4]'
                }`}
              >
                <div className="reveal-image w-full h-full relative overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={img.alt ?? `${exhibit.title} — Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </div>
            </section>
          );
        })}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="h-screen w-screen shrink-0 bg-white text-[#1A1A1A] flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24">
          <div className="w-full max-w-7xl mx-auto">
            <div className="overflow-hidden mb-16 md:mb-24">
              <h2 className="reveal-text pt-24 font-serif text-3xl md:text-5xl lg:text-7xl font-light leading-tight max-w-4xl">
                {exhibit.title} <br /> — {exhibit.subtitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">

              {/* ── Location ──────────────────────────────────────────────── */}
              {location && (
                <div>
                  <div className="overflow-hidden mb-4">
                    <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">
                      Location
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm font-light">
                    {location.venueName && (
                      <li className="overflow-hidden">
                        <span className="reveal-text block font-medium">
                          {location.venueName}
                        </span>
                      </li>
                    )}
                    {location.address && (
                      <li className="overflow-hidden">
                        <span className="reveal-text block text-gray-600">
                          {location.address}
                        </span>
                      </li>
                    )}
                    {(location.city || location.country) && (
                      <li className="overflow-hidden">
                        <span className="reveal-text block text-gray-600">
                          {[location.city, location.country].filter(Boolean).join(', ')}
                        </span>
                      </li>
                    )}
                    {location.mapsUrl && (
                      <li className="overflow-hidden">
                        <a
                          href={location.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="reveal-text block hover:opacity-70 transition-opacity underline underline-offset-2"
                        >
                          View on Google Maps
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* ── Partners ──────────────────────────────────────────────── */}
              {partners.length > 0 && (
                <div>
                  <div className="overflow-hidden mb-4">
                    <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">
                      Partners
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {partners.map((partner, index) => {
                      const logoUrl = partner.logo
                        ? urlFor(partner.logo).width(120).height(60).url()
                        : null;

                      const content = (
                        <div className="flex items-center gap-3">
                          {logoUrl && (
                            <div className="relative w-10 h-10 shrink-0 grayscale hover:grayscale-0 transition-all">
                              <Image
                                src={logoUrl}
                                alt={partner.logo?.alt ?? partner.name ?? ''}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <div>
                            {partner.name && (
                              <p className="text-sm font-medium leading-tight">
                                {partner.name}
                              </p>
                            )}
                            {partner.role && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {partner.role}
                              </p>
                            )}
                          </div>
                        </div>
                      );

                      return (
                        <li key={index} className="overflow-hidden reveal-text">
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:opacity-70 transition-opacity"
                            >
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="lg:col-span-2">
                <div className="overflow-hidden mb-4">
                  <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">
                    Projets Suivants
                  </h3>
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="reveal-text flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <p>© {new Date().getFullYear()} MERSI ARCHITECTURE</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                  <Link href="#" className="hover:text-gray-800 transition-colors">
                    Mentions légales
                  </Link>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Website by FLOT NOIR
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}