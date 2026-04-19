'use client'
import Lenis from 'lenis';
import React, { useEffect } from 'react'
import Section from './Section';

export default function VideoSnippets() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div>
      <Section
        video="/videos/exhibit2.mp4"
        tag="Now On View · Main Gallery"
        title="Echoes of the Unseen"
        description="A sweeping retrospective spanning three decades of work by artist Naledi Osei, exploring the interplay between memory, landscape, and identity through large-scale oil and mixed-media installations."
      />

      <Section
        video="/videos/exhibit3.mp4"
        tag="New Exhibition · East Wing"
        title="Fractures of Light"
        description="An immersive group show uniting seven contemporary photographers whose works interrogate how artificial illumination reshapes urban space, human behavior, and the boundary between day and night."
      />

      <Section
        video="/videos/exhibit4.mp4"
        tag="Opening Soon · Sculpture Court"
        title="The Weight of Silence"
        description="Sculptor Tomás Vega presents monumental bronze and reclaimed-steel forms that confront themes of displacement, collective grief, and resilience — inviting viewers to move through and around each piece as living architecture."
      />
    </div>
  );
}