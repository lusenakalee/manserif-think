"use client";

import Image from "next/image";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { EaselPlugin } from "gsap/EaselPlugin";
import { SplitText } from "gsap/SplitText";
import { Mail } from "lucide-react";

gsap.registerPlugin(useGSAP, EaselPlugin, SplitText, CustomEase);

// ---------------------------------------------------------------------------
// Register custom eases once at module scope (idempotent & SSR-safe because
// this module is only ever evaluated on the client via "use client").
// ---------------------------------------------------------------------------
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
interface IntroImage {
  src: string;
  alt: string;
  isHero?: boolean;
}

const INTRO_IMAGES: IntroImage[] = [
  { src: "/images/charcoal2.webp", alt: "Manserif think 1" },
  { src: "/images/forgive1.webp", alt: "Manserif think 2" },
  { src: "/images/ledivinclean.png", alt: "Manserif think 3", isHero: true },
  { src: "/images/poetic1.webp", alt: "Manserif think 4" },
  { src: "/images/poetic5.webp", alt: "Manserif think 5" },
];

const IMG_SCALE = 0.2;
const IMG_GAP = 40; // px between thumbnail images
const IMG_ROTATIONS: number[] = [-15, 5, 7.5, 10, -2.5];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AnimatedHero() {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const introImgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── GSAP context (replaces useEffect + manual cleanup) ───────────────────
  //
  // useGSAP() scope is tied to `containerRef`, so:
  //   • gsap.utils.selector / contextSafe all resolve within that container
  //   • Everything is automatically reverted on unmount — no tl.kill() needed
  //
  useGSAP(
    () => {
      // ── 1. Layout calculations ──────────────────────────────────────────
      const vw = window.innerWidth;
      const scaledWidth = vw * IMG_SCALE;
      const rowWidth = scaledWidth * 5 + IMG_GAP * 4;
      const centeredStartX = (vw - rowWidth) / 2;
      const offScreenStartX = centeredStartX - vw * 1.3;

      // ── 2. Initial image positions ──────────────────────────────────────
      const centeredXValues: number[] = [];

      introImgRefs.current.forEach((img, i) => {
        if (!img) return;

        // X when images are centred as a row in the viewport
        const centeredX =
          centeredStartX +
          i * (scaledWidth + IMG_GAP) +
          scaledWidth / 2 -
          vw / 2;

        // X when images are waiting off the left edge
        const offScreenX =
          offScreenStartX +
          i * (scaledWidth + IMG_GAP) +
          scaledWidth / 2 -
          vw / 2;

        centeredXValues[i] = centeredX;

        gsap.set(img, {
          scale: IMG_SCALE,
          x: offScreenX,
          rotation: IMG_ROTATIONS[i],
          borderRadius: "2.5rem",
          willChange: "transform",
        });
      });

      // ── 3. SplitText ────────────────────────────────────────────────────
      //
      // Target nav links, the hero h1, and the social links by their
      // data-split attribute so we never rely on fragile CSS class selectors
      // that Tailwind might purge or rename.
      //
      SplitText.create("[data-split]", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        autoSplit: true,
      });

      gsap.set(".split-line", { y: "125%" });

      // ── 4. Main timeline ────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 1 });

      // 4a. Preloader bar sweeps in (left → right) …
      tl.to(preloaderRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: "glide",
        onComplete: () => {
          // Flip transform origin so the next tween sweeps out to the right
          gsap.set(preloaderRef.current, { transformOrigin: "right" });
        },
      });

      // 4b. … then sweeps out
      tl.to(preloaderRef.current, {
        scaleX: 0,
        duration: 1.25,
        ease: "hop",
      });

      // 4c. Overlay clips up and away
      tl.to(
        overlayRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "<0.75",
      );

      // 4d. Thumbnails fly in one by one from the left
      introImgRefs.current.forEach((img, i) => {
        if (!img) return;
        tl.to(
          img,
          { x: centeredXValues[i], duration: 1.5, ease: "glide" },
          "<0.025",
        );
      });

      // 4e. Side pairs fly off screen …
      tl.to(
        [introImgRefs.current[0], introImgRefs.current[1]],
        { x: "-100vw", duration: 1.5, ease: "glide" },
        "spread",
      );
      tl.to(
        [introImgRefs.current[3], introImgRefs.current[4]],
        { x: "100vw", duration: 1.5, ease: "glide" },
        "spread",
      );

      // 4f. … while the hero image expands to fill the viewport
      tl.to(
        introImgRefs.current[2],
        {
          scale: 1,
          x: 0,
          rotation: 0,
          borderRadius: 0,
          duration: 1.5,
          ease: "glide",
        },
        "<",
      );

      // 4g. Text reveals — nav first, then h1, then social
      tl.to(
        "[data-split-nav] .split-line",
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "<1",
      );

      tl.to(
        "[data-split-header] .split-line",
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "<",
      );

      tl.to(
        "[data-split-social] .split-line",
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "<0.25",
      );
    },
    { scope: containerRef }, // ← ties context to the container; auto-reverts on unmount
  );

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    // Outer wrapper that useGSAP uses as its scope
    <div ref={containerRef}>
      {/* ── Preloader overlay ───────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-10 h-svh w-full bg-[#1a1a1a]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      >
        {/* Progress bar */}
        <div
          ref={preloaderRef}
          className="absolute top-0 h-2 w-full origin-left scale-x-0 bg-white will-change-transform"
        />
        <div className="w-full h-screen flex items-center justify-center ">
          <img
            src="/images/manserif-white.png"
            alt="Logo"
            className="animate-pulse h-48 w-auto"
          />
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}


      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative h-svh w-full overflow-hidden">
        {/* Intro images — absolutely stacked, each fills the section */}
        {INTRO_IMAGES.map((image, i) => (
          <div
            key={image.src}
            ref={(el) => {
              introImgRefs.current[i] = el;
            }}
            className="absolute inset-0 overflow-hidden rounded-lg will-change-transform"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={image.isHero}
            />
          </div>
        ))}

        {/* Hero text content */}
        <div className="absolute bottom-8 left-8 right-8 z-[2] flex h-full items-end justify-between">
          {/* Headline */}
          <div data-split-header className="w-3/5 max-[1000px]:w-full">
            <h1 data-split className="text-white  md:pb-0 font-normal leading-[1.1] tracking-[-0.01em] text-[clamp(1.75rem,3vw,3rem)]">
              Multidisciplinary artist sharing evolving work, products, and
              journey.
            </h1>
          </div>

          {/* Social / contact */}
          <div data-split-social className="flex flex-col gap-1  justify-end items-end">
            <p data-split className="text-white no-underline font-normal tracking-[-0.01em] hidden  lg:block">Say Hello</p>
            <a href="mailto:warren@manserifthink.com" data-split className="text-white no-underline font-normal tracking-[-0.01em] hidden  lg:block">
              warren@manserifthink.com
            </a>
            <a href="mailto:warren@manserifthink.com" data-split className="text-white no-underline font-normal tracking-[-0.01em] block md:hidden">
              <Mail className="inline-block   h-6 w-6" /> 
            </a>
             <a href="https://www.instagram.com/manserif.think/" data-split className="text-white no-underline font-normal tracking-[-0.01em] block md:hidden">
              <img src="/images/instagram-white-icon.webp" className="inline-block  h-6 w-6"  /> 
            </a>
          </div>
        </div>
                {/* <div className="w-full h-full  bg-black/40  absolute "/> */}

      </section>
    </div>
  );
}
