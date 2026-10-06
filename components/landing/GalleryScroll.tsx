'use client';

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export interface GalleryPiece {
    name?: string | null;
    src: string | null;
    lqip?: string | null;
}

interface GalleryScrollProps {
    headingLine1?: string | null;
    headingLine2?: string | null;
    subtext?: string | null;
    /** Art pieces chosen in Sanity (any number) */
    images?: GalleryPiece[] | null;
    /** Change this number to get a different random arrangement */
    layoutSeed?: number | null;
}

// Used when nothing has been selected in Sanity yet
const FALLBACK_IMAGES: GalleryPiece[] = [
    { src: "/images/1.jpg", name: "Parallax image 1" },
    { src: "/images/2.jpg", name: "Parallax image 2" },
    { src: "/images/3.jpg", name: "Parallax image 3" },
];

// ── Seeded random (same result on server and client → no hydration mismatch) ──
function mulberry32(seed: number) {
    let a = seed | 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ASPECTS = [3 / 4, 4 / 5, 1, 5 / 4, 4 / 3]; // width / height
const ROW_HEIGHT_VH = 45; // vertical space per pair of images

interface Placement {
    left: number; // vw
    top: number; // vh
    width: number; // vw
    height: number; // vw
    z: number;
    speed: number; // parallax distance in px
}

/**
 * Scatters images in a loose two-lane zig-zag: each pair of images gets its
 * own band of the page, with random size, aspect ratio, horizontal offset,
 * vertical jitter, stacking order and parallax speed.
 */
function buildLayout(count: number, seed: number): Placement[] {
    const rand = mulberry32(seed * 9973 + 17);
    const result: Placement[] = [];

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / 2);
        // Usually alternate lanes, occasionally swap for a less regular feel
        const lane = (i % 2 === 0) !== (rand() > 0.8) ? 0 : 1;

        const width = 16 + rand() * 16; // 16–32vw
        const aspect = ASPECTS[Math.floor(rand() * ASPECTS.length)];
        const height = width / aspect;

        const left =
            lane === 0
                ? 3 + rand() * Math.max(2, 46 - width)
                : 50 + rand() * Math.max(2, 47 - width);

        const top = row * ROW_HEIGHT_VH + rand() * 18 + (lane === 1 ? 12 : 0);

        result.push({
            left,
            top,
            width,
            height,
            z: 1 + Math.floor(rand() * 5),
            speed: 40 + rand() * 200,
        });
    }
    return result;
}

export default function GalleryScroll({
    headingLine1,
    headingLine2,
    subtext,
    images,
    layoutSeed,
}: GalleryScrollProps) {
    const word = subtext || "with gsap";

    const slides = useMemo(() => {
        const valid = (images ?? []).filter((img) => !!img?.src);
        return valid.length ? valid : FALLBACK_IMAGES;
    }, [images]);

    const layout = useMemo(
        () => buildLayout(slides.length, layoutSeed ?? 1),
        [slides.length, layoutSeed]
    );

    const rows = Math.ceil(slides.length / 2);
    const fieldHeightVh = rows * ROW_HEIGHT_VH + 50;

    const container = useRef<HTMLDivElement>(null);
    const header = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const title1 = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduceMotion) return;

        const context = gsap.context(() => {
            // Heading + letters (same effect as before, tied to the header block)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            if (title1.current) tl.to(title1.current, { y: -50 }, 0);

            lettersRef.current.forEach((letter) => {
                if (!letter) return;
                tl.to(letter, {
                    top: Math.floor(Math.random() * -75) - 25,
                }, 0);
            });

            // Every image gets its own scroll-scrubbed parallax. The trigger is
            // the (static) wrapper, the animated element is the inner div.
            gsap.utils
                .toArray<HTMLElement>("[data-parallax]")
                .forEach((wrapper) => {
                    const inner = wrapper.firstElementChild;
                    if (!inner) return;
                    const speed = Number(wrapper.dataset.speed) || 100;

                    gsap.fromTo(
                        inner,
                        { y: speed },
                        {
                            y: -speed,
                            ease: "none",
                            scrollTrigger: {
                                trigger: wrapper,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                });
        }, container);

        return () => context.revert();
    }, [word, layout]);

    return (
        <div ref={container} className="mt-[10vh] min-h-screen overflow-x-clip">
            <div ref={header} className="ml-[10vw]">
                <h1
                    ref={title1}
                    className="m-0 mt-2.5 text-[5vw] leading-[5vw] uppercase"
                >
                    {headingLine1 || "Parallax"}
                </h1>
                <h1 className="m-0 mt-2.5 text-[5vw] leading-[5vw] uppercase">
                    {headingLine2 || "Scroll"}
                </h1>
                <div>
                    <p className="m-0 mt-2.5 text-[3vw] uppercase text-white">
                        {word.split("").map((letter, i) => (
                            <span
                                key={`l_${i}`}
                                ref={(el) => { lettersRef.current[i] = el; }}
                                className="relative"
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </span>
                        ))}
                    </p>
                </div>
            </div>

            <div
                className="relative mt-[5vh] w-full"
                style={{ height: `${fieldHeightVh}vh` }}
            >
                {slides.map((img, i) => {
                    const p = layout[i];
                    return (
                        <div
                            key={`i_${i}_${img.src}`}
                            data-parallax
                            data-speed={Math.round(p.speed)}
                            className="absolute"
                            style={{
                                left: `${p.left}vw`,
                                top: `${p.top}vh`,
                                width: `${p.width}vw`,
                                height: `${p.height}vw`,
                                zIndex: p.z,
                            }}
                        >
                            <div className="relative h-full w-full will-change-transform">
                                <Image
                                    src={img.src as string}
                                    alt={img.name || `Gallery image ${i + 1}`}
                                    fill
                                    sizes={`${Math.ceil(p.width)}vw`}
                                    className="object-cover"
                                    {...(img.lqip
                                        ? { placeholder: "blur" as const, blurDataURL: img.lqip }
                                        : {})}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}