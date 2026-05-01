'use client';

import ProjectDetails from '@/components/projects/ProjectDetails';
import { getProjectBySlug } from '@/data/projects-data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    // Master horizontal scroll
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
        }
      },
    });

    // Text Reveal Animations
    gsap.utils.toArray('.reveal-text').forEach((text: any) => {
      gsap.fromTo(text,
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
          }
        }
      );
    });

    // Image Reveal Animations (Bottom to Top)
    gsap.utils.toArray('.reveal-image-wrapper').forEach((wrapper: any) => {
      const imageContainer = wrapper.querySelector('.reveal-image');
      const image = wrapper.querySelector('img');

      gsap.fromTo(imageContainer,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: scrollTween,
            start: 'left right-=150',
          }
        }
      );

      gsap.fromTo(image,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: scrollTween,
            start: 'left right-=150',
          }
        }
      );
    });

    // Hero animations
    const tl = gsap.timeline();
    tl.fromTo('.hero-title',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
    )
    .fromTo('.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=1'
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="h-screen w-full overflow-hidden bg-[#F5F2ED]">
      {/* Scroll Progress Indicator */}
      <div className="progress-bar fixed top-0 left-0 h-1.5 bg-[#1A1A1A] z-[100] w-full origin-left scale-x-0 mix-blend-difference" />

      <div ref={wrapperRef} className="flex h-full w-max will-change-transform">

        {/* Hero Section */}
        <section className="relative h-screen w-screen shrink-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={project.heroImage}
              alt={project.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10 text-center text-[#F5F2ED] px-6">
            <div className="overflow-hidden mb-6">
              <h1 className="hero-title font-serif text-7xl md:text-9xl font-light tracking-tight">
                {project.title}
              </h1>
            </div>
            <p className="hero-subtitle text-sm md:text-base uppercase tracking-[0.3em] font-medium">
              {project.location ?? project.subtitle}
            </p>
          </div>
        </section>

        {/* Project Details */}
        <ProjectDetails
          title={project.title}
          subtitle={project.subtitle}
          description={project.description}
          note={project.note}
        />

        {/* Gallery Images */}
        {project.images.map((src, index) => (
          <section key={index} className="relative h-screen w-screen md:w-auto shrink-0 flex items-center justify-center px-8 md:px-12 bg-white">
            <div className={`reveal-image-wrapper relative w-full aspect-[4/3] md:w-auto md:h-[70vh] ${index % 2 === 0 ? 'md:aspect-[16/9]' : 'md:aspect-[3/4]'}`}>
              <div className="reveal-image w-full h-full relative overflow-hidden">
                <Image
                  src={src}
                  alt={`${project.title} — Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer className="h-screen w-screen shrink-0 bg-white text-[#1A1A1A] flex flex-col justify-center px-6  py-12  md:px-12 lg:px-24">
          <div className="w-full max-w-7xl mx-auto">
            <div className="overflow-hidden mb-16 md:mb-24">
              <h2 className="reveal-text pt-24 font-serif text-3xl md:text-5xl lg:text-7xl font-light leading-tight max-w-4xl">
               {project.title} <br /> — {project.subtitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">
              <div>
                <div className="overflow-hidden mb-4">
                  <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">Contact</h3>
                </div>
                <ul className="space-y-2 text-sm font-light">
                  <li className="overflow-hidden"><a href="mailto:warrenkamau.art@outlook.com" className="reveal-text block hover:opacity-70 transition-opacity">warrenkamau.art@outlook.com</a></li>
                  <li className="overflow-hidden"><a href="tel:+33172682228" className="reveal-text block hover:opacity-70 transition-opacity">+33 1 72 68 22 28</a></li>
                  <li className="overflow-hidden"><a href="https://wa.me/+33609872775" className="reveal-text block hover:opacity-70 transition-opacity">WhatsApp</a></li>
                </ul>
              </div>

              <div>
                <div className="overflow-hidden mb-4">
                  <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">Socials</h3>
                </div>
                <ul className="space-y-2 text-sm font-light">
                  <li className="overflow-hidden"><a href="#" className="reveal-text block hover:opacity-70 transition-opacity">Instagram</a></li>
                  <li className="overflow-hidden"><a href="#" className="reveal-text block hover:opacity-70 transition-opacity">LinkedIn</a></li>
                  <li className="overflow-hidden"><a href="#" className="reveal-text block hover:opacity-70 transition-opacity">Pinterest</a></li>
                </ul>
              </div>

              <div className="lg:col-span-2">
                <div className="overflow-hidden mb-4">
                  <h3 className="reveal-text text-xs uppercase tracking-[0.2em] text-gray-500">Projets Suivants</h3>
                </div>
               
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="reveal-text flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <p>© {new Date().getFullYear()} MERSI ARCHITECTURE</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                  <Link href="#" className="hover:text-gray-800 transition-colors">Mentions légales</Link>
                  <a href="#" className="hover:text-gray-800 transition-colors">Website by FLOT NOIR</a>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}