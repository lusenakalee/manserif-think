import { ImageResponse } from "next/og";

export const alt =
  "Shop Manserif.Think — original artwork, prints and sculpture by Warren Kamau";
export const size = {
  width: 1200,
  height: 630,
};
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
          padding: "80px",
          background: "#0a0a0a",
          color: "#f5f5f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          <span>Manserif.Think</span>
          <span>Warren Kamau</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Shop
          </span>
          <span
            style={{
              fontSize: 30,
              opacity: 0.75,
              maxWidth: 820,
            }}
          >
            Original paintings, prints, collage &amp; sculpture
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          manserifthink.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}