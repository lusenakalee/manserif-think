'use client';

import React from 'react';
import { motion } from 'motion/react';

interface Video {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  className?: string;
}

const videos: Video[] = [
  {
    id: 'uh5uJSSR5bI',
    title: 'Project Showcase: Deep Dive',
    description: 'An extensive walkthrough of my latest web application, demonstrating key architectural decisions, complex features, and the primary problem the tool aims to solve.',
    embedUrl: 'https://www.youtube.com/embed/uh5uJSSR5bI?start=8',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'zf8NlCeU3U4',
    title: 'Quick Hackathon Demo',
    description: 'A bite-sized pitch and demonstration of the project my team threw together over a single weekend.',
    embedUrl: 'https://www.youtube.com/embed/zf8NlCeU3U4?start=4',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'QdYkPX9yIb0',
    title: 'Development Workflow',
    description: 'A behind-the-scenes look at how I structure my developer environment and ship code iteration quickly.',
    embedUrl: 'https://www.youtube.com/embed/QdYkPX9yIb0',
    className: 'md:col-span-1 md:row-span-1',
  },
];

export default function PortfolioVideos() {
  return (
    <section className="p-6 md:p-10 flex flex-col font-sans max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-1">Supplementary Content</p>
          <h2 className="text-5xl font-bold tracking-tight">EXTRAS</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:text-right opacity-40"
        >
          <p className="text-xs font-mono uppercase">Video Portfolio / 2024</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 flex-grow">
        {videos.map((video, index) => {
          const isFeatured = index === 0;
          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col group ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <div className={`relative w-full ${isFeatured ? 'flex-grow min-h-[300px]' : 'h-56'} bg-zinc-800`}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className={`flex flex-col flex-grow ${isFeatured ? 'p-6 bg-zinc-900/80' : 'p-5'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={isFeatured ? "text-2xl font-semibold mb-2" : "text-lg font-semibold mb-1"}>
                      {video.title}
                    </h3>
                    <p className={`text-zinc-400 ${isFeatured ? "text-sm leading-relaxed max-w-md" : "text-xs line-clamp-2"}`}>
                      {video.description}
                    </p>
                  </div>
                  {isFeatured && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold shrink-0 ml-4 hidden sm:block">Featured</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 flex flex-wrap gap-4 md:gap-8 items-center text-zinc-500 font-mono text-[10px] uppercase tracking-tighter"
      >
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online Repository</span>
        <span>Source: youtube.com</span>
        <span className="md:ml-auto">© 2024 Portfolio Studio</span>
      </motion.div>
    </section>
  );
}
