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
import { ArrowRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExhibitPageClientProps {
  exhibit: NonNullable<EXHIBIT_BY_SLUG_QUERY_RESULT>;
  heroImageUrl: string | null;
}

export default function ExhibitPageClient({ exhibit, heroImageUrl }: ExhibitPageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const detailsPinRef = useRef<HTMLElement>(null);
  const detailsContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !wrapperRef.current ||
        !detailsPinRef.current ||
        !detailsContentRef.current
      )
        return;

      const wrapper = wrapperRef.current;
      const detailsPin = detailsPinRef.current;
      const detailsContent = detailsContentRef.current;

      // ── Horizontal scroll timeline, split into 3 segments ──
      // A: Hero  →  Exhibit Details            (horizontal)
      // B: Exhibit Details content reveal       (horizontal movement locked, vertical)
      // C: Exhibit Details  →  Featured Products / Gallery / Footer / CTA (horizontal)
      let detailsOffset = 0; // px the wrapper travels to bring Details flush left
      let detailsExtraHeight = 0; // px of Details content taller than the viewport
      let totalX = 0; // full horizontal travel distance across the whole page

      const measure = () => {
        detailsOffset = detailsPin.offsetLeft;
        detailsExtraHeight = Math.max(0, detailsContent.scrollHeight - window.innerHeight);
        totalX = wrapper.scrollWidth - window.innerWidth;
      };
      measure();

      const master = gsap.timeline({ paused: true });

      const xToDetails = master.to(wrapper, {
        x: () => -detailsOffset,
        ease: 'none',
        duration: Math.max(detailsOffset, 0.0001),
      });

      const lockDetails = master.to(detailsContent, {
        y: () => -detailsExtraHeight,
        ease: 'none',
        duration: Math.max(detailsExtraHeight, 0.0001),
      });

      const xToEnd = master.to(wrapper, {
        x: () => -totalX,
        ease: 'none',
        duration: Math.max(totalX - detailsOffset, 0.0001),
      });

      ScrollTrigger.create({
        animation: master,
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        end: () => `+=${totalX + detailsExtraHeight}`,
        onRefreshInit: () => {
          measure();
          xToDetails.duration(Math.max(detailsOffset, 0.0001));
          lockDetails.duration(Math.max(detailsExtraHeight, 0.0001));
          xToEnd.duration(Math.max(totalX - detailsOffset, 0.0001));
        },
        onUpdate: (self) => {
          gsap.set('.progress-bar', { scaleX: self.progress });
        },
      });

      // ── Staggered line-reveal for kicker labels, headings, list rows ──
      gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((text) => {
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
              containerAnimation: master,
              start: 'left right-=100',
            },
          }
        );
      });

      // ── Scroll-scrubbed clip-path + scale reveal for gallery imagery ──
      gsap.utils.toArray<HTMLElement>('.reveal-image-wrapper').forEach((wrapperEl) => {
        const imageContainer = wrapperEl.querySelector('.reveal-image');
        const image = wrapperEl.querySelector('img');

        gsap.fromTo(
          imageContainer,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrapperEl,
              containerAnimation: master,
              start: 'left 92%',
              end: 'left 42%',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          image,
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrapperEl,
              containerAnimation: master,
              start: 'left 92%',
              end: 'left 42%',
              scrub: true,
            },
          }
        );
      });

      // ── Hero entrance ──
      const tl = gsap.timeline();
      tl.fromTo(
        '.hero-media',
        { scale: 1.15 },
        { scale: 1, duration: 2, ease: 'power3.out' },
        0
      )
        .fromTo(
          '.hero-title',
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 },
          0
        )
        .fromTo(
          '.hero-subtitle',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08 },
          '-=1'
        );
    },
    { scope: containerRef }
  );

  const location = exhibit.exhibitLocation;
  const partners = exhibit.partners ?? [];
  const images = exhibit.images ?? [];
  const featuredProducts = exhibit.featuredProducts ?? [];

  return (
    <main ref={containerRef} className="h-screen w-full overflow-hidden bg-[#F5F2ED]">
      {/* Scroll Progress Indicator */}
      <div className="progress-bar fixed top-0 left-0 h-[3px] bg-[#1A1A1A] z-[100] w-full origin-left scale-x-0 mix-blend-difference" />

      <div ref={wrapperRef} className="flex h-full w-max will-change-transform">
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section className="relative h-screen w-screen shrink-0 flex flex-col justify-between overflow-hidden px-8 py-10 md:px-16 md:py-14">
          <div className="absolute inset-0 z-0">
            {heroImageUrl && (
              <div className="hero-media absolute inset-0">
                <Image
                  src={heroImageUrl}
                  alt={exhibit.heroImage?.alt ?? exhibit.title ?? ''}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* Top corner labels */}
          <div className="relative z-10 flex items-start justify-between mt-0 md:mt-6 text-[#F5F2ED]">
            <div className="overflow-hidden">
              <span className="hero-subtitle block text-[0.7rem] font-medium uppercase tracking-[0.3em] opacity-80">
                Exhibition
              </span>
            </div>
            {(location?.city || location?.country) && (
              <div className="overflow-hidden">
                <span className="hero-subtitle block text-[0.7rem] font-medium uppercase tracking-[0.3em] opacity-80">
                  {[location?.city, location?.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="relative z-10 text-[#F5F2ED]">
            <div className="overflow-hidden">
              <h1 className="hero-title font-serif text-6xl font-light leading-[0.9] tracking-tight md:text-8xl lg:text-9xl">
                {exhibit.title}
              </h1>
            </div>
            <div className="mt-4 overflow-hidden md:mt-6">
              <p className="hero-subtitle text-sm font-medium uppercase tracking-[0.3em] opacity-80 md:text-base">
                {location?.venueName ?? exhibit.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* ── Exhibit Details ───────────────────────────────────────────── */}
        {/* Full-screen-width viewport: horizontal movement is locked here while
            its content is scrubbed vertically to reveal everything inside it. */}
        <ExhibitDetails
          sectionRef={detailsPinRef}
          contentRef={detailsContentRef}
          title={exhibit.title ?? ''}
          subtitle={exhibit.subtitle ?? ''}
          exhibitDescription={exhibit.exhibitDescription ?? ''}
          artistDescription={exhibit.artistDescription ?? ''}
        />

        {/* ── Featured Products ─────────────────────────────────────────── */}
        {featuredProducts.length > 0 && (
          <section className="h-screen w-max shrink-0 flex flex-col justify-center bg-[#1A1A1A] px-8 md:px-16 lg:px-24">
            <div className="mb-10">
              <div className="mb-2 overflow-hidden">
                <p className="reveal-text text-xs uppercase tracking-[0.3em] text-gray-500">
                  From this Exhibition
                </p>
              </div>
              <div className="overflow-hidden">
                <h2 className="reveal-text font-serif text-3xl font-light text-[#F5F2ED] md:text-5xl">
                  Featured Works
                </h2>
              </div>
            </div>

            <div className="flex h-[55vh] gap-6">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug?.current}`}
                  className="reveal-text group relative flex h-full w-[28vw] min-w-[220px] max-w-[360px] flex-col justify-end overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:bg-white/10"
                >
                  {/* Index number */}
                  <span className="absolute top-5 left-5 z-10 text-xs font-light uppercase tracking-[0.3em] text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Corner arrow accent */}
                  <ArrowUpRight className="absolute top-5 right-5 z-10 h-4 w-4 text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Product image */}
                  {product.images && (
                    <div className="absolute inset-0">
                      <Image
                        src={urlFor(product.images).width(720).height(960).url()}
                        alt={product.name ?? ''}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 80vw, 28vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Product info */}
                  <div className="relative z-10 border-t border-white/10 p-6 transition-colors duration-300 group-hover:border-white/20">
                    <p className="mb-1 font-serif text-lg font-light leading-snug text-[#F5F2ED] transition-transform duration-300 group-hover:translate-x-1 md:text-xl">
                      {product.name}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                      View Work
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery Images ────────────────────────────────────────────── */}
        {images.map((img, index) => {
          const imgUrl = img ? urlFor(img).width(1600).height(900).url() : null;
          if (!imgUrl) return null;

          return (
            <section
              key={index}
              className="relative h-screen w-screen shrink-0 flex flex-col items-center justify-center bg-white px-8 md:w-auto md:px-12"
            >
              <div
                className={`reveal-image-wrapper relative aspect-[4/3] w-full md:h-[68vh] md:w-auto ${
                  index % 2 === 0 ? 'md:aspect-[16/9]' : 'md:aspect-[3/4]'
                }`}
              >
                <div className="reveal-image relative h-full w-full overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={img.alt ?? `${exhibit.title} — Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </div>

              {/* Caption row */}
              <div className="mt-4 flex w-full items-center justify-between md:w-auto">
                <div className="overflow-hidden">
                  <span className="reveal-text block text-[0.65rem] uppercase tracking-[0.25em] text-gray-400">
                    {exhibit.title}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="reveal-text block text-[0.65rem] uppercase tracking-[0.25em] text-gray-400">
                    {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </section>
          );
        })}



  {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="flex h-screen w-screen shrink-0 flex-col justify-center bg-white px-6 py-12 text-[#1A1A1A] md:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-16 overflow-hidden md:mb-24">
              <h2 className="reveal-text pt-24 font-serif text-lg font-light leading-tight max-w-4xl md:text-3xl lg:text-5xl">
                {exhibit.title} <br /> — {exhibit.subtitle}
              </h2>
            </div>

            <div className="mb-16 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
              {/* ── Location ──────────────────────────────────────────── */}
              {location && (
                <div>
                  <div className="mb-4 overflow-hidden">
                    <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">
                      Location
                    </h3>
                  </div>
                  <ul>
                    {location.venueName && (
                      <li className="overflow-hidden border-t border-black/10 py-3 first:border-t-0 first:pt-0">
                        <span className="reveal-text block text-sm font-medium">
                          {location.venueName}
                        </span>
                      </li>
                    )}
                    {location.address && (
                      <li className="overflow-hidden border-t border-black/10 py-3">
                        <span className="reveal-text block text-sm font-light text-gray-600">
                          {location.address}
                        </span>
                      </li>
                    )}
                    {(location.city || location.country) && (
                      <li className="overflow-hidden border-t border-black/10 py-3">
                        <span className="reveal-text block text-sm font-light text-gray-600">
                          {[location.city, location.country].filter(Boolean).join(', ')}
                        </span>
                      </li>
                    )}
                    {location.mapsUrl && (
                      <li className="overflow-hidden border-t border-black/10 py-3">
                        <a
                          href={location.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="reveal-text block text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
                        >
                          View on Google Maps
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* ── Partners ──────────────────────────────────────────── */}
              {partners.length > 0 && (
                <div>
                  <div className="mb-4 overflow-hidden">
                    <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">
                      Partners
                    </h3>
                  </div>
                  <ul>
                    {partners.map((partner, index) => {
                      const logoUrl = partner.logo
                        ? urlFor(partner.logo).width(120).height(60).url()
                        : null;

                      const content = (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {logoUrl && (
                              <div className="relative h-8 w-8 shrink-0 rounded-full grayscale transition-all hover:grayscale-0">
                                <Image
                                  src={logoUrl}
                                  alt={partner.logo?.alt ?? partner.name ?? ''}
                                  fill
                                  className="rounded-full object-contain"
                                />
                              </div>
                            )}
                            <div>
                              {partner.name && (
                                <p className="text-sm font-medium leading-tight">{partner.name}</p>
                              )}
                              {partner.role && (
                                <p className="mt-0.5 text-xs font-light text-gray-500">
                                  {partner.role}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-medium tabular-nums text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      );

                      return (
                        <li
                          key={index}
                          className="reveal-text overflow-hidden border-t border-black/10 py-3 first:border-t-0 first:pt-0"
                        >
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block transition-opacity hover:opacity-70"
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
            </div>
          </div>
        </footer>








        {/* ── CTA Section ───────────────────────────────────────────────── */}
        <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center bg-[#F5F2ED] px-6 text-center">
          <div className="mb-4 overflow-hidden">
            <span className="reveal-text block text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gray-500">
              Continue Exploring
            </span>
          </div>
          <div className="mb-8 max-w-xl overflow-hidden">
            <p className="reveal-text font-serif text-2xl font-light leading-snug text-[#1A1A1A] md:text-3xl">
              Discover more exhibitions from our collection
            </p>
          </div>
          <div className="overflow-hidden">
            <Link
              href="/exhibitions"
              className="reveal-text group inline-flex items-center gap-2 border-b border-[#1A1A1A]/40 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#1A1A1A] transition-opacity hover:opacity-60"
            >
              View All Exhibitions
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      

      </div>
    </main>
  );
}