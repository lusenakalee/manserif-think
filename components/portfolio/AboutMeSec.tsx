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
              `My name is Warren Kamau, an Artist and Fashion Designer from Nairobi, Kenya. I am currently pursuing a Bachelor's Fashion Degree at IFA Paris while working as a freelance artist.`
            )}
          </p>

          <p className="reveal-text text-xl md:text-3xl leading-[1.8] font-medium tracking-tight">
            {splitWords(
              `My work centre's around the Christian Faith, seeking to present it's Truths through and from a  contemporary point of view with the aim of igniting thought.`

)}
          </p>

          <p className="reveal-text text-xl md:text-3xl leading-[1.8] font-medium tracking-tight">
            {splitWords(
              `My current exhibition in Paris at La Galerie in collaboration with the DIASONAMA foundation is an introduction to my work, showcasing former works and future projects. I have worked using different media such as a short films and sculptures, as I continually seek to explore the different art paths that will effectively communicate my message, that is, The Good News of Jesus Christ.`

)}
          </p>
        </div>
      </div>
    </section>
  );
}