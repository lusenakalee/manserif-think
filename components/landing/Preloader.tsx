"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

const PRELOADER_IMAGE_URLS = [
  "https://i.pinimg.com/control1/1200x/e7/da/49/e7da4986508ff3fabc24912a1725f145.jpg",
  "https://i.pinimg.com/1200x/ad/7e/77/ad7e770d17d41b35f08553cf1643f8fe.jpg",
  "https://i.pinimg.com/736x/7d/de/59/7dde590afad25352375fe600f67cc237.jpg",
  "https://i.pinimg.com/1200x/ea/22/c9/ea22c928595fda1f39abf5a3b84c8573.jpg",
  "https://i.pinimg.com/control1/1200x/7d/4f/a0/7d4fa0d720fa7f49dded1e854599c4e0.jpg",
  "https://i.pinimg.com/736x/9a/cd/c5/9acdc5e6672acb43c4648a0d2fce3a52.jpg",
  "https://i.pinimg.com/control1/1200x/b5/6b/c3/b56bc393269820b4ebf7dadc1fd72881.jpg",
  "https://i.pinimg.com/1200x/55/37/d3/5537d33b83fd8cecba407d5c52ae52cf.jpg",
  "https://i.pinimg.com/control1/1200x/14/8e/48/148e480c706e82cfa578b96819db6574.jpg",
  "https://i.pinimg.com/control1/1200x/3e/fe/ad/3efeadb61d5e07a56f7f6e8d3e6fd3e9.jpg",
] as const;

const PAD = 20;
const SESSION_KEY = "preloader_shown";

const Preloader = () => {
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
          // Hide the preloader container after animation finishes
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
        // Move images to bottom-right corner of the HeroSection container
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

  return (
    <div
      ref={root}
      // absolute instead of fixed — scoped to HeroSection's relative container
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
    >
      <div
        className="preloader-backdrop absolute inset-x-0 bottom-0 bg-[#F3F0E7]"
        style={{ height: "100%" }}
      />
      {PRELOADER_IMAGE_URLS.map((src, i) => (
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