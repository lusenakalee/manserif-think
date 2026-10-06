"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

export interface HeroImage {
  src: string | null;
  alt: string;
  lqip?: string | null;
}

interface HeroProps {
  /** Images uploaded in Sanity (heroImages). Optional. */
images?: HeroImage[] | null;
  headline: { prefix: string; highlight: string; suffix: string };
  contact: { label: string; email: string; instagramUrl: string };
  /** Time each image stays visible, in ms */
  interval?: number;
  /** Fade duration, in ms */
  fadeDuration?: number;
}

// Always the first slide, and the only slide if Sanity has no images.
const LOCAL_FIRST_IMAGE: HeroImage = {
  src: "/images/communion.jpg",
  alt: "Communion",
};

export default function HeroSection({
  images,
  headline,
  contact,
  interval = 5000,
  fadeDuration = 1500,
}: HeroProps) {
  const slides = useMemo<HeroImage[]>(() => {
    const remote = (images ?? []).filter((img) => !!img?.src);
    return [LOCAL_FIRST_IMAGE, ...remote];
  }, [images]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    // Respect reduced-motion preferences: stay on the first image.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, interval);

    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <section className="relative h-svh w-full overflow-hidden bg-[#1a1a1a]">
      {slides.map((img, i) => (
        <Image
          key={`${img.src}-${i}`}
          src={img.src as string}
          alt={img.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          aria-hidden={i !== active}
          className="object-cover transition-opacity ease-in-out"
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${fadeDuration}ms`,
          }}
          {...(img.lqip
            ? { placeholder: "blur" as const, blurDataURL: img.lqip }
            : {})}
        />
      ))}

      {/* Optional dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-x-8 bottom-8 z-[2] flex items-end justify-between">
        <div className="w-3/5 max-[1000px]:w-full">
          <h1 className="text-[clamp(1.75rem,3vw,3rem)] font-normal leading-[1.1] tracking-[-0.01em] text-white">
            {headline.prefix}{" "}
            <span className="bg-white px-2 py-1 text-black">
              {headline.highlight}
            </span>{" "}
            {headline.suffix}
          </h1>
        </div>

        {/* <div className="flex flex-col items-end gap-1 text-white">
          <p className="hidden lg:block">{contact.label}</p>
          {contact.email && (
            <>
              <a href={`mailto:${contact.email}`} className="hidden lg:block">
                {contact.email}
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="block md:hidden"
              >
                <Mail className="h-6 w-6" />
              </a>
            </>
          )}
          {contact.instagramUrl && (
            <a
              href={contact.instagramUrl}
              aria-label="Instagram"
              className="block md:hidden"
            >
              <img
                src="/images/instagram-white-icon.webp"
                alt="Instagram"
                className="h-6 w-6"
              />
            </a>
          )}
        </div> */}
      </div>
    </section>
  );
}