import { ImageResponse } from "next/og";

export const alt =
  "Manserif.Think — conceptual art, prints, collage and installations by Warren Kamau";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f0",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* eyebrow row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9a9a90",
          }}
        >
          <span>Nairobi, Kenya</span>
          <span>Art Studio &amp; Archive</span>
        </div>

        {/* wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            Manserif.Think
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#c9c9c0",
              letterSpacing: 1,
            }}
          >
            Conceptual paintings, prints, collage &amp; installations
          </div>
        </div>

        {/* rule + credit row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{ width: "100%", height: 1, backgroundColor: "#3a3a35" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#9a9a90",
              letterSpacing: 2,
            }}
          >
            <span>By Warren Kamau</span>
            <span>manserifthink.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}