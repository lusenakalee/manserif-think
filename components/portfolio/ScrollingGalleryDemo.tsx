import ScrollingGallery from "@/components/ui/ScrollingGallery";
import React from "react";

const ScrollingGalleryDemo = () => {
  const galleryImages = [
    { src: "/images/charcoal1.webp", alt: "charcoal1", speed: 0.7 },
    { src: "/images/charcoal2.webp", alt: "charcoal2", speed: 0.9 },
    { src: "/images/charcoal3.webp", alt: "charcoal3", speed: 1.1 },
    { src: "/images/charcoal4.webp", alt: "charcoal4", speed: 0.8 },
    { src: "/images/charcoal5.webp", alt: "charcoal5", speed: 1.2 },
          { src: "/images/charcoal6.webp", alt: "charcoal6", speed: 0.6 },

  ];
  return (
    <>
      <ScrollingGallery images={galleryImages} />
    </>
  );
};

export default ScrollingGalleryDemo;
