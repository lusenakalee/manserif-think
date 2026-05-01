"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreloaderProps {
  /**
   * Ordered list of image URLs to display during the preloader animation.
   * Passed in from HeroSection after resolving Sanity asset references.
   * Falls back to an empty array (no images shown) if omitted.
   */
  imageUrls?: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAD = 20;
const SESSION_KEY = "preloader_shown";

// ─── Component ────────────────────────────────────────────────────────────────

const Preloader = ({ imageUrls = [] }: PreloaderProps) => {
  const root = useRef<HTMLDivElement>(null);
  // null = not yet determined (SSR), true = show, false = skip
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);

  // Determine once on the client whether to show the preloader
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) {
      setShouldRender(false);
    } else {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShouldRender(true);
    }
  }, []);

  useGSAP(
    () => {
      // Only run animation when we've confirmed we should render
      if (!shouldRender) return;

      const el = root.current;
      if (!el) return;

      const images = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll(".preloader-image")
      );
      if (!images.length) return;

      const firstImage = images[0];
      const notFirstImages = images.slice(1);
      const lastImage = images[images.length - 1];
      const notLastImages = images.slice(0, -1);

      const duration = 1;

      gsap.set(images, { x: 0, y: 0, scale: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (el) el.style.display = "none";
        },
      });

      tl.to(firstImage, { scale: 1, duration, ease: "power3.out" });
      tl.to(
        notFirstImages,
        { scale: 1, duration, ease: "power3.out", stagger: 0.12 },
        `<${duration / 3}`
      );

      let dx = 0;
      let dy = 0;

      tl.call(() => {
        const containerRect = el.getBoundingClientRect();
        const rect = firstImage.getBoundingClientRect();
        dx = containerRect.right - rect.right - PAD;
        dy = containerRect.bottom - rect.bottom - PAD;
      });

      const backdrop = el.querySelector(".preloader-backdrop");
      const totalMoveDuration = duration + 0.12 * (notLastImages.length - 1);

      tl.to(notLastImages, {
        x: () => dx,
        y: () => dy,
        duration,
        ease: "power2.inOut",
        stagger: 0.1,
      });

      tl.to(
        images,
        {
          keyframes: {
            "15%": { scale: 1.15, ease: "power2.in" },
            "45%": { scale: 1.5, ease: "power2.out" },
            "100%": { scale: 1, ease: "power3.inOut" },
          },
          duration,
          stagger: 0.1,
        },
        "<"
      );

      tl.to(
        backdrop,
        {
          height: "0%",
          duration: totalMoveDuration,
          ease: "power2.inOut",
        },
        "<"
      );

      tl.to(
        lastImage,
        {
          x: () => dx,
          y: () => dy,
          duration,
          ease: "power2.inOut",
        },
        `<${duration - 0.1}`
      );

      const resize = () => {
        tl.progress(0).invalidate().restart();
      };
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    },
    { scope: root, dependencies: [shouldRender] }
  );

  // Don't render anything until we know (avoids SSR mismatch)
  if (shouldRender === null || !shouldRender) return null;

  // Nothing to animate if no images were provided
  if (!imageUrls.length) return null;

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
    >
      <div
        className="preloader-backdrop absolute inset-x-0 bottom-0 bg-[#F3F0E7]"
        style={{ height: "100%" }}
      />
      {imageUrls.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className="preloader-image absolute left-5 top-5 aspect-video w-1/3 max-w-xl origin-center scale-0 rounded-xl object-cover will-change-transform"
          style={{ zIndex: i }}
        />
      ))}
    </div>
  );
};

export default Preloader;