"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMeSec() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray<HTMLElement>(".reveal-text");

      paragraphs.forEach((paragraph) => {
        const words = paragraph.querySelectorAll(".word");

        gsap.fromTo(
          words,
          {
            opacity: 0.1,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: "power3.out",
            duration: 1,
            scrollTrigger: {
              trigger: paragraph,
              start: "top 85%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitWords = (text: string) => {
    return text.split(" ").map((word, index) => (
      <span
        key={index}
        className="word inline-block mr-[0.35em] will-change-transform"
      >
        {word}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white text-black py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-16 text-4xl md:text-6xl font-semibold tracking-tight">
          About
        </h2>

        <div className="space-y-16">
          <p className="reveal-text text-xl md:text-3xl leading-[1.8] font-medium tracking-tight">
            {splitWords(
              "My name is Warren Gathigi Kamau, and Man Serif.Think is the creative space where thought, faith, and artistry converge. It is more than an art studio—it is a living thought bubble, a personal archive of vision and imagination, where each piece reflects a journey of introspection, spiritual inquiry, and creative expression. Rooted in faith and guided by purpose, this portfolio marks the beginning of a path whose destination is unknown, yet whose foundation is firmly entrusted to God."
            )}
          </p>

          <p className="reveal-text text-xl md:text-3xl leading-[1.8] font-medium tracking-tight">
            {splitWords(
              "Through Man Serif.Think, I present a collection of conceptual paintings, prints, collages, and sculptures that reinterpret biblical anecdotes through contemporary visual language. My work spans both abstract and realistic styles, recontextualizing ancient truths to make them resonate with the modern mind. Each artwork invites viewers to engage with timeless spiritual narratives in fresh, familiar, and thought-provoking ways—while also offering original pieces, samples, and products available for collection and purchase."
            )}
          </p>

          <p className="reveal-text text-xl md:text-3xl leading-[1.8] font-medium tracking-tight">
            {splitWords(
              "This is the start of a new journey—one shaped by curiosity, devotion, and the courage to create without knowing exactly where the road leads. Every piece is a step forward, a conversation between the sacred and the present, and a testament to the belief that what begins with faith is carried through to completion. Welcome to Man Serif.Think, where art becomes both reflection and revelation."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}