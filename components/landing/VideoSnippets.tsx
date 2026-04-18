'use client'
import Lenis from 'lenis';
import React, { useEffect } from 'react'
import Section from './Section';
import BgOverview from "@/public/images/bg-overview.jpeg";
import Symphony1 from "@/public/images/symphony1.png";
import Wilma1 from "@/public/images/wilma1.png";

export default function VideoSnippets() {

    useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);



  return (
    <div>
       <Section
        image={Symphony1}
        tag="Latest Developments and New Launches"
        title="Stay updated with our latest projects and property launches."
        description="From exciting new residential communities to cutting-edge commercial developments and prime land acquisitions, Mugwere Real Estate is constantly evolving to bring you the best in real estate opportunities. Explore our newest additions below."
      />
      
     
          <Section
        image={Wilma1}
        tag="Featured Development"
        title="Wilma Towers"
        description=" The Wilma Towers creates an inviting living atmosphere that fulfills all wishes. The external Architecture and the interior designs are perfectly combined to create an oasis of calmness in a busy world."
      />
      
    </div>
  )
}
