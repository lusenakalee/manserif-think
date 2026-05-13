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
        video="/videos/garment.mp4"
        tag="RAW FILES* "
        title="GARMENT 001"
        description="Unedited Raw Footage of Toile fittings circa 2022, files that had no date of when they'd see the light.We decided to keep it as raw as possible, as if you were alongside us, only with inserted texts that give context and information on the project as a whole.."
      />

      <Section
        video="/videos/merchant.mp4"
        tag="Short Film"
        title="THE MERCHANT IS COMING"
        description="This short film is based on a poem written by The Poet Michael, following a caged bird&apos;s longing to be freed by The Merchant, that is, Christ, and how she will no longer be overlooked, her insights not considered, but will be weighed.This short film was re-scripted and shot within 4 hours by the Project OCTOBER* team. This is the first of our short film series to be released on this page. SUBSCRIBE to follow on the creative journey."
      />

   
    </div>
  );
}