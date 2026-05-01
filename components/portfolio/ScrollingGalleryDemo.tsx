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
    <main
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        fontFamily: '"DM Mono", monospace',
      }}
    >
      {/* Hero intro section */}
      <section
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "8vh 8vw",
          background: "#0d0d0d",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "11px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          2024 — Archive
        </p>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: "clamp(52px, 9vw, 140px)",
            color: "#fff",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            maxWidth: "80vw",
            marginBottom: "3rem",
          }}
        >
          A visual
          <br />
          collection.
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          ↓ scroll to explore
        </p>
      </section>

      {/* Horizontal gallery — pinned scroll section */}
      <ScrollingGallery images={galleryImages} id="manserif-gallery" />

      {/* Footer section */}
      <section
        style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.12)",
            fontSize: "10px",
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Manserif Studio
        </p>
        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            fontSize: "clamp(28px, 4vw, 56px)",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "-0.02em",
          }}
        >
          End of archive.
        </p>
      </section>
    </main>
  );
};

export default ScrollingGalleryDemo;